import { createServer } from "node:http"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { createReadStream, existsSync } from "node:fs"
import { spawn } from "node:child_process"
import { tmpdir } from "node:os"
import { extname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const DEFAULT_SCALE = Number(process.env.FIGURE_EXPORT_SCALE || 4)
const chromeCandidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean)

const mimeTypes = new Map([
  [".css", "text/css"],
  [".html", "text/html"],
  [".js", "text/javascript"],
  [".json", "application/json"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain"],
])

class CdpClient {
  constructor(webSocketUrl) {
    this.id = 0
    this.pending = new Map()
    this.waiters = []
    this.socket = new WebSocket(webSocketUrl)
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data)

      if (message.id) {
        const pending = this.pending.get(message.id)
        if (!pending) {
          return
        }

        this.pending.delete(message.id)
        if (message.error) {
          pending.reject(
            new Error(`${message.error.message}: ${message.error.data || ""}`),
          )
        } else {
          pending.resolve(message.result || {})
        }
        return
      }

      this.waiters = this.waiters.filter((waiter) => {
        if (
          waiter.method === message.method &&
          (!waiter.sessionId || waiter.sessionId === message.sessionId)
        ) {
          waiter.resolve(message.params || {})
          return false
        }

        return true
      })
    })
  }

  async open() {
    if (this.socket.readyState === WebSocket.OPEN) {
      return
    }

    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true })
      this.socket.addEventListener("error", reject, { once: true })
    })
  }

  send(method, params = {}, sessionId) {
    const id = ++this.id
    const payload = { id, method, params }
    if (sessionId) {
      payload.sessionId = sessionId
    }

    this.socket.send(JSON.stringify(payload))
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
    })
  }

  waitFor(method, sessionId) {
    return new Promise((resolve) => {
      this.waiters.push({ method, sessionId, resolve })
    })
  }

  close() {
    this.socket.close()
  }
}

function findChrome() {
  const chrome = chromeCandidates.find((candidate) => existsSync(candidate))
  if (!chrome) {
    throw new Error(
      "Could not find Chrome. Set CHROME_BIN to a Chrome or Chromium executable.",
    )
  }

  return chrome
}

function serveStatic(root) {
  const resolvedRoot = resolve(root)
  const rootPrefix = `${resolvedRoot}/`

  const server = createServer((request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1")
    const pathname = decodeURIComponent(url.pathname)
    const filePath = join(
      resolvedRoot,
      pathname === "/" ? "index.html" : pathname,
    )

    if (filePath !== resolvedRoot && !filePath.startsWith(rootPrefix)) {
      response.writeHead(403)
      response.end("Forbidden")
      return
    }

    const stream = createReadStream(filePath)
    stream.on("error", () => {
      response.writeHead(404)
      response.end("Not found")
    })
    response.setHeader(
      "Content-Type",
      mimeTypes.get(extname(filePath)) || "application/octet-stream",
    )
    stream.pipe(response)
  })

  return new Promise((resolve, reject) => {
    server.on("error", reject)
    server.listen(0, "127.0.0.1", () => {
      const address = server.address()
      if (!address || typeof address === "string") {
        reject(new Error("Could not bind export server."))
        return
      }

      resolve({ server, url: `http://127.0.0.1:${address.port}/` })
    })
  })
}

async function launchChrome() {
  const userDataDir = await mkdtemp(join(tmpdir(), "slides-chrome-"))
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-default-browser-check",
    "--no-first-run",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "about:blank",
  ]

  if (process.platform === "linux") {
    args.unshift("--no-sandbox")
  }

  const chrome = spawn(findChrome(), args, {
    stdio: ["ignore", "ignore", "pipe"],
  })

  const webSocketUrl = await new Promise((resolve, reject) => {
    let stderr = ""
    const timer = setTimeout(() => {
      reject(new Error(`Timed out waiting for Chrome DevTools.\n${stderr}`))
    }, 15_000)

    chrome.stderr.on("data", (chunk) => {
      stderr += chunk.toString()
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/)
      if (match) {
        clearTimeout(timer)
        resolve(match[1])
      }
    })

    chrome.on("exit", (code) => {
      clearTimeout(timer)
      reject(
        new Error(`Chrome exited before startup with code ${code}.\n${stderr}`),
      )
    })
    chrome.on("error", reject)
  })

  return { chrome, userDataDir, webSocketUrl }
}

async function stopChrome(chrome) {
  if (chrome.exitCode !== null || chrome.signalCode !== null) {
    return
  }

  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 2000)
    chrome.once("exit", () => {
      clearTimeout(timer)
      resolve()
    })
    chrome.kill()
  })
}

async function readFiguresFromPage(client, sessionId, scale) {
  const expression = `
    (async () => {
      const SVG_NS = "http://www.w3.org/2000/svg";
      const scale = ${JSON.stringify(scale)};

      function loadImage(src) {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error("Could not rasterize SVG."));
          image.src = src;
        });
      }

      async function exportSvg(svg) {
        const width = Number(svg.dataset.exportWidth);
        const height = Number(svg.dataset.exportHeight);
        const slug = svg.dataset.figureSlug;
        const title = svg.getAttribute("aria-label") || slug;
        const clone = svg.cloneNode(true);
        clone.setAttribute("xmlns", SVG_NS);
        clone.setAttribute("width", String(width));
        clone.setAttribute("height", String(height));
        clone.setAttribute("viewBox", "0 0 " + width + " " + height);

        const background = document.createElementNS(SVG_NS, "rect");
        background.setAttribute("width", "100%");
        background.setAttribute("height", "100%");
        background.setAttribute("fill", "#ffffff");
        clone.insertBefore(background, clone.firstChild);

        const svgBlob = new Blob([new XMLSerializer().serializeToString(clone)], {
          type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        try {
          const image = await loadImage(svgUrl);
          const canvas = document.createElement("canvas");
          canvas.width = width * scale;
          canvas.height = height * scale;

          const context = canvas.getContext("2d");
          if (!context) {
            throw new Error("Could not create canvas context.");
          }

          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          return {
            slug,
            title,
            width: canvas.width,
            height: canvas.height,
            dataUrl: canvas.toDataURL("image/png"),
          };
        } finally {
          URL.revokeObjectURL(svgUrl);
        }
      }

      await document.fonts?.ready;
      const svgs = Array.from(document.querySelectorAll("svg[data-figure-slug]"));
      return Promise.all(svgs.map(exportSvg));
    })()
  `

  const result = await client.send(
    "Runtime.evaluate",
    {
      expression,
      awaitPromise: true,
      returnByValue: true,
    },
    sessionId,
  )

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Figure export failed.")
  }

  return result.result.value
}

export async function exportFigurePngs({
  pageUrl,
  outputDir = resolve("dist", "figures"),
  scale = DEFAULT_SCALE,
} = {}) {
  if (!pageUrl) {
    throw new Error("exportFigurePngs requires a pageUrl.")
  }

  if (typeof WebSocket === "undefined") {
    throw new Error(
      "This export script requires Node.js with global WebSocket.",
    )
  }

  const { chrome, userDataDir, webSocketUrl } = await launchChrome()
  const client = new CdpClient(webSocketUrl)

  try {
    await client.open()
    const { targetId } = await client.send("Target.createTarget", {
      url: "about:blank",
    })
    const { sessionId } = await client.send("Target.attachToTarget", {
      targetId,
      flatten: true,
    })

    await client.send("Page.enable", {}, sessionId)
    await client.send("Runtime.enable", {}, sessionId)

    const loaded = client.waitFor("Page.loadEventFired", sessionId)
    await client.send("Page.navigate", { url: pageUrl }, sessionId)
    await loaded

    const figures = await readFiguresFromPage(client, sessionId, scale)
    await mkdir(outputDir, { recursive: true })

    await Promise.all(
      figures.map((figure) => {
        const base64 = figure.dataUrl.replace("data:image/png;base64,", "")
        const path = join(outputDir, `${figure.slug}.png`)
        return writeFile(path, Buffer.from(base64, "base64"))
      }),
    )

    return figures
  } finally {
    client.close()
    await stopChrome(chrome)
    await rm(userDataDir, { recursive: true, force: true })
  }
}

export async function exportBuiltFigurePngs({
  root = resolve("dist"),
  outputDir = join(root, "figures"),
  scale = DEFAULT_SCALE,
} = {}) {
  const { server, url } = await serveStatic(root)

  try {
    return await exportFigurePngs({ pageUrl: url, outputDir, scale })
  } finally {
    server.close()
  }
}

function logFigures(figures, outputDir) {
  for (const figure of figures) {
    console.log(
      `exported ${join(outputDir, `${figure.slug}.png`)} (${figure.width}x${figure.height})`,
    )
  }
}

async function main() {
  const root = resolve("dist")
  const outputDir = join(root, "figures")
  const figures = await exportBuiltFigurePngs({ root, outputDir })
  logFigures(figures, outputDir)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
