import { C } from "../palette"

type ArrowVariant = "logical" | "physical" | "muted" | "network" | "semantic"

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  variant = "logical",
  double,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  variant?: ArrowVariant
  double?: boolean
}) {
  const map = {
    logical: { color: C.ink, w: 1.5, marker: "mk-ink", dash: undefined },
    physical: { color: C.blue, w: 2.4, marker: "mk-blue", dash: undefined },
    muted: { color: C.darkGray, w: 1.1, marker: "mk-gray", dash: undefined },
    network: { color: C.blue, w: 1.8, marker: "mk-blue", dash: "6 5" },
    semantic: { color: C.teal, w: 1.9, marker: "mk-teal", dash: undefined },
  } as const
  const s = map[variant]

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={s.color}
      strokeWidth={s.w}
      strokeDasharray={s.dash}
      markerEnd={`url(#${s.marker})`}
      markerStart={double ? `url(#${s.marker})` : undefined}
    />
  )
}

export function Edge({
  x1,
  y1,
  x2,
  y2,
  color = C.darkGray,
  width = 1.25,
  dashed,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color?: string
  width?: number
  dashed?: boolean
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? "4 3" : undefined}
      strokeLinecap="round"
    />
  )
}

export function ExchangeBoundary({
  x1,
  x2,
  y,
  label = "NETWORK EXCHANGE",
}: {
  x1: number
  x2: number
  y: number
  label?: string
}) {
  const mid = (x1 + x2) / 2
  const lw = label.length * 6 + 24

  return (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={C.blue}
        strokeWidth={1.5}
        strokeDasharray="6 5"
      />
      <rect
        x={mid - lw / 2}
        y={y - 11}
        width={lw}
        height={22}
        rx={11}
        fill={C.white}
        stroke={C.blue}
        strokeWidth={1.2}
      />
      <text
        x={mid}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight={700}
        letterSpacing={1}
        fill={C.blue}
      >
        {label}
      </text>
    </g>
  )
}
