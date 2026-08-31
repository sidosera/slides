import { C, FONT_MONO } from "../palette"
import { STATE_FILL, fitMono } from "./styles"

export function StateColumn({
  x,
  y,
  w,
  h,
  cellHeight,
  states,
  sourceX,
  marker = "mk-gray",
}: {
  x: number
  y: number
  w: number
  h: number
  cellHeight: number
  states: readonly string[]
  sourceX: number
  marker?: string
}) {
  return (
    <g>
      {states.map((state, index) => {
        const rowY = y + index * cellHeight + (cellHeight - h) / 2
        return (
          <g key={`${state}-${index}`}>
            <line
              x1={sourceX}
              y1={rowY + h / 2}
              x2={x - 8}
              y2={rowY + h / 2}
              stroke={C.mediumGray}
              strokeWidth={1.15}
              markerEnd={`url(#${marker})`}
            />
            <rect
              x={x}
              y={rowY}
              width={w}
              height={h}
              fill={STATE_FILL}
              stroke={C.lightPink}
              strokeWidth={1}
            />
            <text
              x={x + w / 2}
              y={rowY + h / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={fitMono(state, w, 9, 6.2)}
              fontWeight={700}
              fill={C.pink}
            >
              {state}
            </text>
          </g>
        )
      })}
    </g>
  )
}
