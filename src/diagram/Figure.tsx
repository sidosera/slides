import type { ReactNode } from "react";
import { Markers } from "./grammar";

// Wraps a single figure: a small removable header (eyebrow number + title +
// subtitle) above a self-contained, white, export-ready SVG canvas.
export function Figure({
  number,
  title,
  subtitle,
  width,
  height,
  children,
}: {
  number: string;
  title: string;
  subtitle?: string;
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <figure className="w-full">
      <figcaption className="mb-4">
        <span className="font-mono text-[11px] font-medium tracking-widest text-dark-gray">
          FIGURE {number}
        </span>
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
  );
}
