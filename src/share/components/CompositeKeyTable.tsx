import { C } from "../palette"
import { Ellipsis, KeySegment } from "./Chip"
import { SectionTitle, SmallTag } from "./Text"

export type CompositeKeySegment = {
  x: number
  w: number
  label: string
  fill: string
  stroke: string
  color: string
  size?: number
  opacity?: number
  h?: number
}

export type CompositeKeyRow = {
  id: string
  label?: string
  segments: readonly CompositeKeySegment[]
  ellipsisX?: number
  tag?: {
    x: number
    text: string
  }
}

export function CompositeKeyTable({
  x,
  y,
  w,
  rowH,
  chipH = 18,
  rows,
  labelY,
  label = "KEYS",
  rowLabelSize,
  tagSize,
  ellipsisSize = 11,
}: {
  x: number
  y: number
  w: number
  rowH: number
  chipH?: number
  rows: readonly CompositeKeyRow[]
  labelY?: number
  label?: string
  rowLabelSize?: number
  tagSize?: number
  ellipsisSize?: number
}) {
  return (
    <g>
      {rows.map((row, index) => {
        const rowY = y + 17 + index * rowH
        const cy = rowY + chipH / 2
        return (
          <g key={row.id}>
            {index > 0 && (
              <line
                x1={x}
                y1={rowY - 4}
                x2={x + w}
                y2={rowY - 4}
                stroke={C.mediumGray}
                strokeWidth={0.35}
                opacity={0.45}
              />
            )}
            {row.label && (
              <SmallTag x={x + 10} y={cy} size={rowLabelSize}>
                {row.label}
              </SmallTag>
            )}
            {row.segments.map((segment, segmentIndex) => (
              <KeySegment
                key={`${row.id}-${segmentIndex}`}
                x={segment.x}
                y={rowY}
                w={segment.w}
                h={segment.h ?? chipH}
                label={segment.label}
                fill={segment.fill}
                stroke={segment.stroke}
                color={segment.color}
                size={segment.size}
                opacity={segment.opacity}
              />
            ))}
            {row.ellipsisX !== undefined && (
              <Ellipsis x={row.ellipsisX} y={cy} size={ellipsisSize} />
            )}
            {row.tag && (
              <SmallTag x={row.tag.x} y={cy} size={tagSize}>
                {row.tag.text}
              </SmallTag>
            )}
          </g>
        )
      })}
      {label && labelY !== undefined && (
        <SectionTitle x={x + w / 2} y={labelY} size={6.6}>
          {label}
        </SectionTitle>
      )}
    </g>
  )
}
