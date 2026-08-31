import { C, FONT_MONO } from "../palette"
import { Ellipsis } from "./Chip"
import {
  BLOCK_FIELD_SIZE,
  BLOCK_TYPE_SIZE,
  DASH,
  FRAME_RADIUS,
  RADIUS,
  VALUE_SIZE,
  fitMono,
} from "./styles"

export function PageStack({
  x,
  y,
  w,
  h,
  slices = 2,
  soft = false,
}: {
  x: number
  y: number
  w: number
  h: number
  slices?: number
  soft?: boolean
}) {
  if (soft) {
    return (
      <g>
        {Array.from({ length: slices }, (_, index) => slices - index).map((i) => (
          <rect
            key={i}
            x={x + i * 8}
            y={y + i * 7}
            width={w}
            height={h}
            fill="none"
            stroke="#edf1f6"
            strokeWidth={0.8}
            opacity={0.42 - i * 0.08}
          />
        ))}
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill="rgba(247,249,252,0.48)"
          stroke="#edf1f6"
          strokeWidth={0.8}
        />
      </g>
    )
  }

  return (
    <g>
      {Array.from({ length: slices }, (_, index) => slices - index).map((i) => (
        <rect
          key={i}
          x={x + i * 12}
          y={y + i * 10}
          width={w}
          height={h}
          fill="none"
          stroke={C.darkGray}
          strokeWidth={1}
          strokeDasharray={DASH}
          opacity={0.28 - i * 0.05}
        />
      ))}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={C.mediumGray}
        strokeWidth={1}
        strokeDasharray={DASH}
        opacity={0.72}
      />
    </g>
  )
}

export function TypedBlock({
  x,
  y,
  w,
  h,
  headerHeight,
  cellHeight,
  field,
  blockType,
  values,
  color,
  stroke,
  fill,
  valueSize = VALUE_SIZE,
  blockTypeMaxSize = BLOCK_TYPE_SIZE,
  blockTypeMinSize = 6.4,
}: {
  x: number
  y: number
  w: number
  h: number
  headerHeight: number
  cellHeight: number
  field: string
  blockType: string
  values: readonly string[]
  color: string
  stroke: string
  fill: string
  valueSize?: number
  blockTypeMaxSize?: number
  blockTypeMinSize?: number
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={headerHeight}
        fill={fill}
        stroke="none"
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
      />
      <line
        x1={x}
        y1={y + headerHeight}
        x2={x + w}
        y2={y + headerHeight}
        stroke={stroke}
        strokeWidth={0.75}
      />
      <text
        x={x + w / 2}
        y={y + 10}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={fitMono(blockType, w, blockTypeMaxSize, blockTypeMinSize)}
        fontWeight={700}
        fill={color}
      >
        {blockType}
      </text>
      <text
        x={x + w / 2}
        y={y + headerHeight - 8}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={BLOCK_FIELD_SIZE}
        fontWeight={600}
        fill={color}
        opacity={0.82}
      >
        {field}
      </text>
      {values.map((value, rowIndex) => {
        const rowY = y + headerHeight + rowIndex * cellHeight
        return (
          <g key={`${value}-${rowIndex}`}>
            {rowIndex > 0 && (
              <line
                x1={x}
                y1={rowY}
                x2={x + w}
                y2={rowY}
                stroke={stroke}
                strokeWidth={0.4}
                opacity={0.45}
              />
            )}
            <text
              x={x + w / 2}
              y={rowY + cellHeight / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={valueSize}
              fontWeight={600}
              fill={color}
            >
              {value}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export type BlockPageItem = {
  kind?: "block"
  field: string
  blockType: string
  values: readonly string[]
  w: number
  color: string
  stroke: string
  fill: string
  valueSize?: number
  blockTypeMaxSize?: number
  blockTypeMinSize?: number
} | {
  kind: "ellipsis"
  w: number
  size?: number
}

export function rowWidth(items: readonly { w: number }[], gap: number) {
  return (
    items.reduce((sum, item) => sum + item.w, 0) +
    Math.max(0, items.length - 1) * gap
  )
}

export function BlockPage({
  pageX,
  pageY,
  pageW,
  pageH,
  blockX,
  blockY,
  blockH,
  headerHeight,
  cellHeight,
  gap,
  items,
  softFrame = false,
}: {
  pageX: number
  pageY: number
  pageW: number
  pageH: number
  blockX: number
  blockY: number
  blockH: number
  headerHeight: number
  cellHeight: number
  gap: number
  items: readonly BlockPageItem[]
  softFrame?: boolean
}) {
  let x = blockX
  return (
    <g>
      <PageStack x={pageX} y={pageY} w={pageW} h={pageH} soft={softFrame} />
      {items.map((item, index) => {
        const itemX = x
        x += item.w + gap

        if (item.kind === "ellipsis") {
          return (
            <Ellipsis
              key={`ellipsis-${index}`}
              x={itemX + item.w / 2}
              y={blockY + headerHeight + (blockH - headerHeight) / 2}
              size={item.size}
            />
          )
        }

        return (
          <TypedBlock
            key={item.field}
            x={itemX}
            y={blockY}
            w={item.w}
            h={blockH}
            headerHeight={headerHeight}
            cellHeight={cellHeight}
            field={item.field}
            blockType={item.blockType}
            values={item.values}
            color={item.color}
            stroke={item.stroke}
            fill={item.fill}
            valueSize={item.valueSize}
            blockTypeMaxSize={item.blockTypeMaxSize}
            blockTypeMinSize={item.blockTypeMinSize}
          />
        )
      })}
    </g>
  )
}
