import { C, FONT_MONO } from "../palette"
import { SectionTitle } from "./Text"

export function OrdinalVector({
  x,
  y,
  w,
  cellHeight,
  values,
  label,
  labelY,
  labelSize = 7.4,
}: {
  x: number
  y: number
  w: number
  cellHeight: number
  values: readonly string[]
  label?: string
  labelY?: number
  labelSize?: number
}) {
  const h = values.length * cellHeight
  return (
    <g>
      {label && (
        <SectionTitle x={x + w / 2} y={labelY ?? y + h + 10} size={labelSize}>
          {label}
        </SectionTitle>
      )}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={C.lightGray}
        stroke={C.mediumGray}
        strokeWidth={1}
      />
      {values.map((value, index) => {
        const rowY = y + index * cellHeight
        return (
          <g key={`${value}-${index}`}>
            {index > 0 && (
              <line
                x1={x}
                y1={rowY}
                x2={x + w}
                y2={rowY}
                stroke={C.mediumGray}
                strokeWidth={0.4}
                opacity={0.65}
              />
            )}
            <text
              x={x + w / 2}
              y={rowY + cellHeight / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={8.2}
              fontWeight={750}
              fill={C.mutedInk}
            >
              {value}
            </text>
          </g>
        )
      })}
    </g>
  )
}
