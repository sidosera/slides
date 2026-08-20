import { C, FONT_MONO } from "../palette"
import { fitMono } from "./styles"

export function Chip({
  x,
  y,
  text,
  color = C.ink,
  size = 12,
  anchor = "middle",
  padX = 9,
  h = 22,
}: {
  x: number
  y: number
  text: string
  color?: string
  size?: number
  anchor?: "start" | "middle" | "end"
  padX?: number
  h?: number
}) {
  const w = text.length * size * 0.62 + padX * 2
  const rx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x

  return (
    <g>
      <rect
        x={rx}
        y={y - h / 2}
        width={w}
        height={h}
        rx={5}
        fill={C.lightGray}
        stroke={C.mediumGray}
        strokeWidth={1}
      />
      <text
        x={rx + w / 2}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={size}
        fill={color}
      >
        {text}
      </text>
    </g>
  )
}

export function Ellipsis({
  x,
  y,
  size = 21,
}: {
  x: number
  y: number
  size?: number
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily={FONT_MONO}
      fontSize={size}
      fontWeight={700}
      fill={C.darkGray}
    >
      ...
    </text>
  )
}

export function KeySegment({
  x,
  y,
  w,
  h = 18,
  label,
  fill,
  stroke,
  color,
  size = 7.2,
  opacity = 1,
}: {
  x: number
  y: number
  w: number
  h?: number
  label: string
  fill: string
  stroke: string
  color: string
  size?: number
  opacity?: number
}) {
  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        fill={fill}
        stroke={stroke}
        strokeWidth={0.75}
      />
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={Math.min(size, fitMono(label, w, size, 6.2))}
        fontWeight={650}
        fill={color}
      >
        {label}
      </text>
    </g>
  )
}
