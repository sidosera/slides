import { resolve } from "node:path"
import { exportBuiltFigurePngs, exportFigurePngs } from "./export-figures.mjs"

export function figurePngExportPlugin({
  debounceMs = Number(process.env.FIGURE_EXPORT_DEBOUNCE_MS || 700),
  scale = Number(process.env.FIGURE_EXPORT_SCALE || 4),
} = {}) {
  let config
  let server
  let timer
  let exporting = false
  let queued = false

  function outputDir() {
    return resolve(config.root, config.build.outDir, "figures")
  }

  function log(message) {
    config.logger.info(`[figures] ${message}`)
  }

  async function runDevExport(reason) {
    if (!server?.resolvedUrls?.local.length) {
      return
    }

    if (exporting) {
      queued = true
      return
    }

    exporting = true
    queued = false
    const pageUrl = server.resolvedUrls.local[0]

    try {
      const figures = await exportFigurePngs({
        pageUrl,
        outputDir: outputDir(),
        scale,
      })
      log(`regenerated ${figures.length} PNGs after ${reason}`)
    } catch (error) {
      config.logger.error(`[figures] ${error.stack || error.message}`)
    } finally {
      exporting = false
      if (queued) {
        scheduleDevExport("queued changes")
      }
    }
  }

  function scheduleDevExport(reason) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      runDevExport(reason)
    }, debounceMs)
  }

  return {
    name: "slides:figure-png-export",
    apply: "serve",
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    configureServer(viteServer) {
      server = viteServer
    },
    handleHotUpdate({ file }) {
      scheduleDevExport(file)
    },
  }
}

export function figurePngBuildExportPlugin({
  scale = Number(process.env.FIGURE_EXPORT_SCALE || 4),
} = {}) {
  let config

  return {
    name: "slides:figure-png-build-export",
    apply: "build",
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    async closeBundle() {
      const root = resolve(config.root, config.build.outDir)
      const outputDir = resolve(root, "figures")
      const figures = await exportBuiltFigurePngs({ root, outputDir, scale })
      for (const figure of figures) {
        config.logger.info(
          `[figures] exported ${figure.slug}.png (${figure.width}x${figure.height})`,
        )
      }
    },
  }
}
