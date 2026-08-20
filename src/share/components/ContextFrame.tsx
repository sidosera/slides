import { C } from "../palette"
import { DASH, FRAME_RADIUS } from "./styles"

export function ContextFrame({
  x,
  y,
  w,
  h,
  color = C.darkGray,
  opacity = 0.56,
}: {
  x: number
  y: number
  w: number
  h: number
  color?: string
  opacity?: number
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={FRAME_RADIUS}
      fill="none"
      stroke={color}
      strokeWidth={1}
      strokeDasharray={DASH}
      opacity={opacity}
    />
  )
}
