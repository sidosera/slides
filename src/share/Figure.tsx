import type { ReactNode } from "react"
import { Markers } from "./components/Markers"

function safeFilename(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96)
}

// Wraps a single figure: a small removable header (eyebrow number + title +
// subtitle) above a self-contained, white, export-ready SVG canvas.
export function Figure({
  number,
  showNumber = true,
  title,
  subtitle,
  width,
  height,
  children,
}: {
  number: string
  showNumber?: boolean
  title: string
  subtitle?: string
  width: number
  height: number
  children: ReactNode
}) {
  const exportSlug = safeFilename(`${number}-${title}`)

  return (
    <figure className="w-full">
      <figcaption className="mb-4">
        {showNumber && (
          <span className="font-mono text-[11px] font-medium tracking-widest text-dark-gray">
            FIGURE {number}
          </span>
        )}
        <h3 className="mt-1 text-[19px] font-semibold leading-snug text-dark-ink">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 max-w-[62ch] text-[13.5px] leading-relaxed text-ink/70">
            {subtitle}
          </p>
        )}
      </figcaption>
      <svg
        data-figure-slug={exportSlug}
        data-export-width={width}
        data-export-height={height}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-label={title}
        style={{ display: "block", fontFamily: "'Inter', sans-serif" }}
      >
        <Markers />
        {children}
      </svg>
    </figure>
  )
}
