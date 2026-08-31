import { C, FONT_MONO } from "../palette"
import { FILL, STROKE, TEXT, type Variant } from "./styles"

export function Node({
  x,
  y,
  w,
  h,
  label,
  sub,
  variant = "neutral",
  mono,
  dashed,
  radius = 7,
}: {
  x: number
  y: number
  w: number
  h: number
  label?: string
  sub?: string
  variant?: Variant
  mono?: boolean
  dashed?: boolean
  radius?: number
}) {
  const cx = x + w / 2
  const cy = y + h / 2
  const labelY = sub ? cy - 6 : cy

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={FILL[variant]}
        stroke={STROKE[variant]}
        strokeWidth={variant === "neutral" || variant === "muted" ? 1 : 1.5}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      {label && (
        <text
          x={cx}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={14}
          fontWeight={650}
          fontFamily={mono ? FONT_MONO : undefined}
          fill={TEXT[variant]}
        >
          {label}
        </text>
      )}
      {sub && (
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fontWeight={500}
          fill={C.mutedInk}
        >
          {sub}
        </text>
      )}
    </g>
  )
}
