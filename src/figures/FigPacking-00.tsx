import { JSX } from "react"
import { Figure } from "../diagram/Figure"
import { GroupLabel } from "../diagram/grammar"
import { C, TINT, FONT_MONO } from "../diagram/palette"

// FIGURE 16 — Flat composite key: step embedded alongside label dims.
// Top: a Page made of typed Blocks. Bottom: BytesRefHash(Page) assigns
// ordinals from flat composite keys; those ordinals index partial states.

const W = 960

const SVC_NGINX_WEST = "nginx-proxy.us-west-1"
const SVC_API_EAST = "api-gate.us-east-1"

const ROWS = [
  { step: "1000 s", pod: "1", svc: SVC_NGINX_WEST, region: "us-west-1" },
  { step: "1000 s", pod: "2", svc: SVC_API_EAST, region: "us-east-1" },
  { step: "1060 s", pod: "1", svc: SVC_NGINX_WEST, region: "us-west-1" },
  { step: "1060 s", pod: "2", svc: SVC_API_EAST, region: "us-east-1" },
]

const HASH_ENTRIES = ROWS.map((row, ord) => ({
  ...row,
  podKey: `pod=${row.pod}`,
  ord: `${ord}`,
  byteTag: "64b",
}))

const INPUT_COLS = [
  {
    field: "step",
    blockType: "Block$I64",
    vals: ROWS.map((r) => r.step),
    w: 88,
    color: C.darkTeal,
    stroke: C.teal,
    fill: TINT.semantic,
    valueSize: 10,
  },
  {
    field: "pod_id",
    blockType: "Block$I32",
    vals: ROWS.map((r) => r.pod),
    w: 72,
    color: C.darkBlue,
    stroke: C.elasticBlue,
    fill: TINT.physical,
    valueSize: 11,
  },
  {
    field: "service",
    blockType: "Block$OrdinalByteRef",
    vals: ROWS.map((r) => r.svc),
    w: 184,
    color: C.darkGray,
    stroke: C.darkGray,
    fill: C.white,
    valueSize: 8,
  },
  {
    field: "region",
    blockType: "Block$OrdinalByteRef",
    vals: ROWS.map((r) => r.region),
    w: 116,
    color: C.darkGray,
    stroke: C.darkGray,
    fill: C.white,
    valueSize: 8.5,
  },
] as const

const INPUT_TOP = 74
const INPUT_HDR = 30
const INPUT_CELL = 30
const INPUT_H = INPUT_HDR + ROWS.length * INPUT_CELL
const INPUT_GAP = 14
const MORE_W = 34
const INPUT_TOTAL_W =
  INPUT_COLS[0].w +
  INPUT_GAP +
  INPUT_COLS[1].w +
  INPUT_GAP +
  INPUT_COLS[2].w +
  INPUT_GAP +
  MORE_W +
  INPUT_GAP +
  INPUT_COLS[3].w
const INPUT_X0 = Math.round((W - INPUT_TOTAL_W) / 2)
const INPUT_PAGE_X = INPUT_X0 - 18
const INPUT_PAGE_Y = INPUT_TOP - 18
const INPUT_PAGE_W = INPUT_TOTAL_W + 36
const INPUT_PAGE_H = INPUT_H + 34

const HASH_X = 104
const HASH_TOP = INPUT_TOP + INPUT_H + 74
const HASH_W = W - 2 * HASH_X
const HASH_HDR = 0

const KEY_X = INPUT_PAGE_X + 18
const KEY_Y = HASH_TOP + 34
const KEY_W = 312
const KEY_H = 132
const KEY_ROW_H = 26

const ORD_X = 560
const ORD_Y = KEY_Y + 16
const ORD_W = 36
const ORD_CELL_H = 25
const ORD_H = HASH_ENTRIES.length * ORD_CELL_H

const STATE_W = 106
const STATE_X = INPUT_PAGE_X + INPUT_PAGE_W - 18 - STATE_W
const STATE_H = 20

const HASH_H = KEY_Y + KEY_H - HASH_TOP + 40
const TOTAL_H = HASH_TOP + HASH_H + 54

const BLOCK_HASH_FRAME_X = KEY_X - 8
const BLOCK_HASH_FRAME_Y = KEY_Y - 16
const BLOCK_HASH_FRAME_W = ORD_X + ORD_W - BLOCK_HASH_FRAME_X + 10
const BLOCK_HASH_FRAME_H = KEY_H + 20

const AGG_FRAME_X = BLOCK_HASH_FRAME_X - 14
const AGG_FRAME_Y = BLOCK_HASH_FRAME_Y - 18
const AGG_FRAME_W = STATE_X + STATE_W + 10 - AGG_FRAME_X
const AGG_FRAME_H = BLOCK_HASH_FRAME_H + 36
const CONTEXT_LABEL_Y = BLOCK_HASH_FRAME_Y - 12
const AGG_LABEL_Y = AGG_FRAME_Y - 12

function inputX(index: number) {
  if (index === 0) return INPUT_X0
  if (index === 1) return INPUT_X0 + INPUT_COLS[0].w + INPUT_GAP
  if (index === 2) return inputX(1) + INPUT_COLS[1].w + INPUT_GAP
  return inputX(2) + INPUT_COLS[2].w + INPUT_GAP + MORE_W + INPUT_GAP
}

function inputCenter(index: number) {
  return inputX(index) + INPUT_COLS[index].w / 2
}

function fitMono(text: string, width: number, max = 9, min = 6.4) {
  return Math.max(min, Math.min(max, (width - 10) / (text.length * 0.58)))
}

function InputPageStack() {
  return (
    <g>
      {[2, 1].map((i) => (
        <rect
          key={i}
          x={INPUT_PAGE_X + i * 12}
          y={INPUT_PAGE_Y + i * 10}
          width={INPUT_PAGE_W}
          height={INPUT_PAGE_H}
          rx={8}
          fill="none"
          stroke={C.darkGray}
          strokeWidth={1}
          strokeDasharray="3 4"
          opacity={0.44 - i * 0.06}
        />
      ))}
      <rect
        x={INPUT_PAGE_X}
        y={INPUT_PAGE_Y}
        width={INPUT_PAGE_W}
        height={INPUT_PAGE_H}
        rx={8}
        fill="none"
        stroke={C.mediumGray}
        strokeWidth={1}
        strokeDasharray="3 4"
        opacity={0.9}
      />
    </g>
  )
}

function InputBlock({
  x,
  w,
  field,
  blockType,
  vals,
  color,
  stroke,
  fill,
  valueSize,
}: {
  x: number
  w: number
  field: string
  blockType: string
  vals: readonly string[]
  color: string
  stroke: string
  fill: string
  valueSize: number
}) {
  return (
    <g>
      <rect x={x} y={INPUT_TOP} width={w} height={INPUT_HDR} rx={6} fill={fill} stroke="none" />
      <rect
        x={x}
        y={INPUT_TOP}
        width={w}
        height={INPUT_H}
        rx={6}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
      />
      <line
        x1={x}
        y1={INPUT_TOP + INPUT_HDR}
        x2={x + w}
        y2={INPUT_TOP + INPUT_HDR}
        stroke={stroke}
        strokeWidth={0.75}
      />
      <text
        x={x + w / 2}
        y={INPUT_TOP + 10}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={fitMono(blockType, w)}
        fontWeight={700}
        fill={color}
      >
        {blockType}
      </text>
      <text
        x={x + w / 2}
        y={INPUT_TOP + 23}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={6.6}
        fontWeight={600}
        fill={color}
        opacity={0.82}
      >
        {field}
      </text>
      {vals.map((value, rowIndex) => {
        const y = INPUT_TOP + INPUT_HDR + rowIndex * INPUT_CELL
        return (
          <g key={rowIndex}>
            {rowIndex > 0 && (
              <line
                x1={x}
                y1={y}
                x2={x + w}
                y2={y}
                stroke={stroke}
                strokeWidth={0.4}
                opacity={0.45}
              />
            )}
            <text
              x={x + w / 2}
              y={y + INPUT_CELL / 2}
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

function MoreBlocks() {
  const x = inputX(2) + INPUT_COLS[2].w + INPUT_GAP
  return (
    <text
      x={x + MORE_W / 2}
      y={INPUT_TOP + INPUT_HDR + (INPUT_H - INPUT_HDR) / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily={FONT_MONO}
      fontSize={21}
      fontWeight={700}
      fill={C.darkGray}
    >
      ...
    </text>
  )
}

function KeySegment({
  x,
  y,
  w,
  label,
  fill,
  stroke,
  color,
  size = 8,
  opacity = 1,
}: {
  x: number
  y: number
  w: number
  label: string
  fill: string
  stroke: string
  color: string
  size?: number
  opacity?: number
}) {
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={w} height={18} rx={3} fill={fill} stroke={stroke} strokeWidth={0.75} />
      <text
        x={x + w / 2}
        y={y + 9}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={Math.min(size, fitMono(label, w, size, 5.7))}
        fontWeight={650}
        fill={color}
      >
        {label}
      </text>
    </g>
  )
}

function CompositeKeyRow({
  entry,
  index,
}: {
  entry: (typeof HASH_ENTRIES)[number]
  index: number
}) {
  const y = KEY_Y + 17 + index * KEY_ROW_H
  const cy = y + 9
  const x = KEY_X + 42

  return (
    <g>
      {index > 0 && (
        <line
          x1={KEY_X}
          y1={y - 4}
          x2={KEY_X + KEY_W}
          y2={y - 4}
          stroke={C.mediumGray}
          strokeWidth={0.35}
          opacity={0.45}
        />
      )}
      <text
        x={KEY_X + 10}
        y={cy}
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={6.8}
        fontWeight={600}
        fill={C.darkGray}
        opacity={0.65}
      >
        KEY {index + 1}:
      </text>
      <KeySegment x={x} y={y} w={48} label={entry.step} fill={TINT.semantic} stroke={C.teal} color={C.darkTeal} size={7.2} opacity={0.68} />
      <KeySegment x={x + 51} y={y} w={42} label={entry.podKey} fill={TINT.physical} stroke={C.elasticBlue} color={C.darkBlue} size={7.2} opacity={0.68} />
      <KeySegment x={x + 96} y={y} w={106} label={entry.svc} fill={C.lightGray} stroke={C.mediumGray} color={C.darkGray} size={6.6} />
      <text
        x={x + 211}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={11}
        fontWeight={700}
        fill={C.darkGray}
      >
        ...
      </text>
      <KeySegment x={x + 221} y={y} w={54} label={entry.region} fill={C.lightGray} stroke={C.mediumGray} color={C.darkGray} size={6.4} />
      <text
        x={x + 282}
        y={cy}
        textAnchor="start"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={6.8}
        fontWeight={600}
        fill={C.darkGray}
        opacity={0.65}
      >
        {entry.byteTag}
      </text>
    </g>
  )
}

function CompositeKeyBlocks() {
  return (
    <g>
      {HASH_ENTRIES.map((entry, index) => (
        <CompositeKeyRow key={entry.ord} entry={entry} index={index} />
      ))}
      <SectionTitle x={KEY_X + KEY_W / 2} y={ORD_Y + ORD_H + 10} size={6.6}>
        KEYS
      </SectionTitle>
    </g>
  )
}

function ContextFrame({
  x,
  y,
  w,
  h,
  color,
}: {
  x: number
  y: number
  w: number
  h: number
  color: string
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill="none"
        stroke={color}
        strokeWidth={0.9}
        strokeDasharray="3 4"
        opacity={0.72}
      />
    </g>
  )
}

function SectionTitle({
  x,
  y,
  children,
  color = C.darkGray,
  size = 8,
}: {
  x: number
  y: number
  children: string | JSX.Element
  color?: string
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
      letterSpacing={1}
      fill={color}
    >
      {children}
    </text>
  )
}

function OrdinalsVector() {
  return (
    <g>
      <SectionTitle x={ORD_X + ORD_W / 2} y={ORD_Y + ORD_H + 10} size={6.6}>
        ORDINALS
      </SectionTitle>
      <rect x={ORD_X} y={ORD_Y} width={ORD_W} height={ORD_H} rx={4} fill={C.lightGray} stroke={C.mediumGray} strokeWidth={1} />
      {HASH_ENTRIES.map((entry, index) => {
        const y = ORD_Y + index * ORD_CELL_H
        return (
          <g key={entry.ord}>
            {index > 0 && (
              <line x1={ORD_X} y1={y} x2={ORD_X + ORD_W} y2={y} stroke={C.mediumGray} strokeWidth={0.4} opacity={0.65} />
            )}
            <text
              x={ORD_X + ORD_W / 2}
              y={y + ORD_CELL_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={7.2}
              fontWeight={750}
              fill={C.darkGray}
            >
              {entry.ord}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function GroupStates() {
  return (
    <g>
      {HASH_ENTRIES.map((entry, index) => {
        const y = ORD_Y + index * ORD_CELL_H + (ORD_CELL_H - STATE_H) / 2
        return (
          <g key={entry.ord}>
            <line
              x1={ORD_X + ORD_W + 8}
              y1={y + STATE_H / 2}
              x2={STATE_X - 8}
              y2={y + STATE_H / 2}
              stroke={C.mediumGray}
              strokeWidth={1}
              markerEnd="url(#mk-gray)"
            />
            <rect
              x={STATE_X}
              y={y}
              width={STATE_W}
              height={STATE_H}
              rx={3}
              fill="rgba(240,78,152,0.05)"
              stroke={C.lightPink}
              strokeWidth={0.8}
            />
            <text
              x={STATE_X + STATE_W / 2}
              y={y + STATE_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={fitMono(`GroupingState$${index}`, STATE_W, 8, 4.8)}
              fontWeight={700}
              fill={C.pink}
            >
              GroupingState${"$"}{index}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export function Figure16NoPacking() {
  const inputBottom = INPUT_TOP + INPUT_H
  const arrowY = KEY_Y + KEY_H / 2
  const arrowX1 = KEY_X + KEY_W + 16
  const arrowX2 = ORD_X - 10

  return (
    <Figure
      number="16"
      title="Flat composite key: step embedded in every entry"
      subtitle="Before the hierarchical map, a single flat BytesRefHash held the full composite key — step bytes prepended to every label-dimension key. With K evaluation steps and M unique label combinations, the map grows to K×M entries and step bytes bloat every key regardless of label repetition."
      width={W}
      height={TOTAL_H}
    >
      <defs>
        <marker
          id="mk-teal-small"
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="4.5"
          markerHeight="4.5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={C.teal} />
        </marker>
      </defs>
      <GroupLabel x={INPUT_X0} y={INPUT_TOP - 22}>
        INPUT PAGE
      </GroupLabel>

      <InputPageStack />
      {INPUT_COLS.map((col, index) => (
        <InputBlock
          key={col.field}
          x={inputX(index)}
          w={col.w}
          field={col.field}
          blockType={col.blockType}
          vals={col.vals}
          color={col.color}
          stroke={col.stroke}
          fill={col.fill}
          valueSize={col.valueSize}
        />
      ))}
      <MoreBlocks />

      <line x1={W / 2} y1={inputBottom + 12} x2={W / 2} y2={HASH_TOP - 10} stroke={C.darkGray} strokeWidth={1.4} markerEnd="url(#mk-gray)" />

      <ContextFrame
        x={AGG_FRAME_X}
        y={AGG_FRAME_Y}
        w={AGG_FRAME_W}
        h={AGG_FRAME_H}
        color={C.darkGray}
      />
      <GroupLabel x={INPUT_X0} y={AGG_LABEL_Y}>
        AGGREGATE
      </GroupLabel>

      <ContextFrame
        x={BLOCK_HASH_FRAME_X}
        y={BLOCK_HASH_FRAME_Y}
        w={BLOCK_HASH_FRAME_W}
        h={BLOCK_HASH_FRAME_H}
        color={C.teal}
      />
      <SectionTitle x={BLOCK_HASH_FRAME_X + BLOCK_HASH_FRAME_W / 2} y={BLOCK_HASH_FRAME_Y + 14} color={C.darkTeal}>
          HASH(step, pod_id, service, ..., region)
      </SectionTitle>
      <CompositeKeyBlocks />

      <line x1={arrowX1} y1={arrowY} x2={arrowX2} y2={arrowY} stroke={C.mediumGray} strokeWidth={0.9} markerEnd="url(#mk-gray)" />

      <OrdinalsVector />
      <GroupStates />

    </Figure>
  )
}
