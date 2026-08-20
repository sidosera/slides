import { Figure } from "../diagram/Figure"
import { GroupLabel } from "../diagram/grammar"
import { C, TINT, FONT_MONO } from "../diagram/palette"

// FIGURE 16 COPY — Packed dimension bytes feeding BlockHash aggregation.

const W = 960

const SVC_NGINX_WEST = "nginx-proxy.us-west-1"
const SVC_API_EAST = "api-gate.us-east-1"

const ROWS = [
  { step: "1000 s", pod: "1", svc: SVC_NGINX_WEST, region: "us-west-1", packed: "p0" },
  { step: "1000 s", pod: "2", svc: SVC_API_EAST, region: "us-east-1", packed: "p1" },
  { step: "1060 s", pod: "1", svc: SVC_NGINX_WEST, region: "us-west-1", packed: "p0" },
  { step: "1060 s", pod: "2", svc: SVC_API_EAST, region: "us-east-1", packed: "p1" },
]

const PACKED_VALUES = [
  { packed: "p0", podKey: "pod=1", svc: SVC_NGINX_WEST, region: "us-west-1", size: "56b" },
  { packed: "p1", podKey: "pod=2", svc: SVC_API_EAST, region: "us-east-1", size: "56b" },
]

const AGG_ENTRIES = ROWS.map((row, index) => ({
  step: row.step,
  packed: row.packed,
  hashOrd: `${index}`,
  state: `GroupingState$${index}`,
  size: "16B",
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

const PACK_TOP = INPUT_TOP + INPUT_H + 76
const PACK_HDR = 30
const PACK_CELL = 24
const PACK_H = PACK_HDR + ROWS.length * PACK_CELL
const PACK_STEP_W = 82
const PACK_ORD_W = 82
const PACK_GAP = 12
const PACK_BLOCKS_W = PACK_STEP_W + PACK_GAP + PACK_ORD_W
const PACK_HASH_W = 286
const PACK_PAGE_GAP = 34
const PACK_PAGE_W = PACK_BLOCKS_W + PACK_PAGE_GAP + PACK_HASH_W + 32
const PACK_PAGE_X = Math.round((W - PACK_PAGE_W) / 2)
const PACK_PAGE_Y = PACK_TOP - 18
const PACK_PAGE_H = PACK_H + 34
const PACK_STEP_X = PACK_PAGE_X + 16
const PACK_ORD_X = PACK_STEP_X + PACK_STEP_W + PACK_GAP
const PAGE_HASH_X = PACK_ORD_X + PACK_ORD_W + PACK_PAGE_GAP
const PAGE_HASH_Y = PACK_TOP + 3
const PAGE_HASH_H = 82

const AGG_TOP = PACK_TOP + PACK_H + 78
const AGG_FRAME_X = INPUT_PAGE_X
const AGG_FRAME_Y = AGG_TOP
const AGG_FRAME_W = INPUT_PAGE_W
const AGG_FRAME_H = 198
const AGG_LABEL_Y = AGG_FRAME_Y - 12

const AGG_KEY_X = INPUT_X0
const AGG_KEY_Y = AGG_FRAME_Y + 44
const AGG_KEY_W = 212
const AGG_KEY_H = 126
const AGG_KEY_ROW_H = 26

const AGG_ORD_X = AGG_KEY_X + AGG_KEY_W + 70
const AGG_ORD_Y = AGG_KEY_Y + 16
const AGG_ORD_W = 36
const AGG_ORD_CELL_H = 25
const AGG_ORD_H = AGG_ENTRIES.length * AGG_ORD_CELL_H

const AGG_BLOCKHASH_X = AGG_KEY_X - 8
const AGG_BLOCKHASH_Y = AGG_KEY_Y - 16
const AGG_BLOCKHASH_W = AGG_ORD_X + AGG_ORD_W - AGG_BLOCKHASH_X + 10
const AGG_BLOCKHASH_H = AGG_KEY_H + 32

const STATE_X = INPUT_PAGE_X + INPUT_PAGE_W - 18 - 108
const STATE_W = 108
const STATE_H = 18

const TOTAL_H = AGG_FRAME_Y + AGG_FRAME_H + 28

function inputX(index: number) {
  if (index === 0) return INPUT_X0
  if (index === 1) return INPUT_X0 + INPUT_COLS[0].w + INPUT_GAP
  if (index === 2) return inputX(1) + INPUT_COLS[1].w + INPUT_GAP
  return inputX(2) + INPUT_COLS[2].w + INPUT_GAP + MORE_W + INPUT_GAP
}

function fitMono(text: string, width: number, max = 9, min = 6.4) {
  return Math.max(min, Math.min(max, (width - 10) / (text.length * 0.58)))
}

function PageStack({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      {[2, 1].map((i) => (
        <rect
          key={i}
          x={x + i * 12}
          y={y + i * 10}
          width={w}
          height={h}
          rx={8}
          fill="none"
          stroke={C.darkGray}
          strokeWidth={1}
          strokeDasharray="3 4"
          opacity={0.44 - i * 0.06}
        />
      ))}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
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
  y,
  w,
  h,
  hdr,
  cell,
  field,
  blockType,
  vals,
  color,
  stroke,
  fill,
  valueSize,
}: {
  x: number
  y: number
  w: number
  h: number
  hdr: number
  cell: number
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
      <rect x={x} y={y} width={w} height={hdr} rx={6} fill={fill} stroke="none" />
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={stroke} strokeWidth={1.5} />
      <line x1={x} y1={y + hdr} x2={x + w} y2={y + hdr} stroke={stroke} strokeWidth={0.75} />
      <text
        x={x + w / 2}
        y={y + 10}
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
        y={y + hdr - 8}
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
        const rowY = y + hdr + rowIndex * cell
        return (
          <g key={rowIndex}>
            {rowIndex > 0 && (
              <line x1={x} y1={rowY} x2={x + w} y2={rowY} stroke={stroke} strokeWidth={0.4} opacity={0.45} />
            )}
            <text
              x={x + w / 2}
              y={rowY + cell / 2}
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
  children: string
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

function KeySegment({
  x,
  y,
  w,
  label,
  fill,
  stroke,
  color,
  size = 6.4,
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
      <rect x={x} y={y} width={w} height={16} rx={3} fill={fill} stroke={stroke} strokeWidth={0.75} />
      <text
        x={x + w / 2}
        y={y + 8}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={Math.min(size, fitMono(label, w, size, 5.2))}
        fontWeight={650}
        fill={color}
      >
        {label}
      </text>
    </g>
  )
}

function PackedPage() {
  return (
    <g>
      <GroupLabel x={INPUT_X0} y={PACK_TOP - 22}>
        PACKING
      </GroupLabel>
      <PageStack x={PACK_PAGE_X} y={PACK_PAGE_Y} w={PACK_PAGE_W} h={PACK_PAGE_H} />
      <InputBlock
        x={PACK_STEP_X}
        y={PACK_TOP}
        w={PACK_STEP_W}
        h={PACK_H}
        hdr={PACK_HDR}
        cell={PACK_CELL}
        field="step"
        blockType="Block$I64"
        vals={ROWS.map((r) => r.step)}
        color={C.darkTeal}
        stroke={C.teal}
        fill={TINT.semantic}
        valueSize={8.2}
      />
      <InputBlock
        x={PACK_ORD_X}
        y={PACK_TOP}
        w={PACK_ORD_W}
        h={PACK_H}
        hdr={PACK_HDR}
        cell={PACK_CELL}
        field="_packed"
        blockType="Block$BytesRef"
        vals={ROWS.map((r) => r.packed)}
        color={C.poppy}
        stroke={C.poppy}
        fill={TINT.error}
        valueSize={7.2}
      />
      <line
        x1={PACK_ORD_X + PACK_ORD_W + 8}
        y1={PACK_TOP + PACK_H / 2}
        x2={PAGE_HASH_X - 8}
        y2={PACK_TOP + PACK_H / 2}
        stroke={C.mediumGray}
        strokeWidth={1}
        markerEnd="url(#mk-gray-small)"
      />
      <PackedValuesTable />
    </g>
  )
}

function PackedValuesTable() {
  return (
    <g>
      <rect x={PAGE_HASH_X} y={PAGE_HASH_Y} width={PACK_HASH_W} height={PAGE_HASH_H} rx={6} fill="none" stroke={C.poppy} strokeWidth={1} />
      <rect x={PAGE_HASH_X} y={PAGE_HASH_Y} width={PACK_HASH_W} height={22} rx={6} fill={TINT.error} stroke="none" />
      <text
        x={PAGE_HASH_X + PACK_HASH_W / 2}
        y={PAGE_HASH_Y + 11}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={7.2}
        fontWeight={700}
        fill={C.poppy}
        letterSpacing={0.5}
      >
        Block$OrdinalByteRef.Dict
      </text>
      {PACKED_VALUES.map((entry, index) => {
        const y = PAGE_HASH_Y + 31 + index * 24
        return (
          <g key={entry.packed}>
            {index > 0 && (
              <line x1={PAGE_HASH_X} y1={y - 6} x2={PAGE_HASH_X + PACK_HASH_W} y2={y - 6} stroke={C.mediumGray} strokeWidth={0.35} opacity={0.45} />
            )}
            <text
              x={PAGE_HASH_X + 13}
              y={y + 8}
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={6.2}
              fontWeight={700}
              fill={C.darkGray}
            >
              {entry.packed}
            </text>
            <KeySegment x={PAGE_HASH_X + 30} y={y} w={42} label={entry.podKey} fill={TINT.physical} stroke={C.elasticBlue} color={C.darkBlue} opacity={0.68} />
            <KeySegment x={PAGE_HASH_X + 76} y={y} w={92} label={entry.svc} fill={C.lightGray} stroke={C.mediumGray} color={C.darkGray} size={6} />
            <text
              x={PAGE_HASH_X + 175}
              y={y + 8}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={9}
              fontWeight={700}
              fill={C.darkGray}
            >
              ...
            </text>
            <KeySegment x={PAGE_HASH_X + 184} y={y} w={48} label={entry.region} fill={C.lightGray} stroke={C.mediumGray} color={C.darkGray} size={5.9} />
            <text
              x={PAGE_HASH_X + 242}
              y={y + 8}
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={6.2}
              fontWeight={600}
              fill={C.darkGray}
              opacity={0.65}
            >
              {entry.size}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function AggregateKeyRow({
  entry,
  index,
}: {
  entry: (typeof AGG_ENTRIES)[number]
  index: number
}) {
  const y = AGG_KEY_Y + 17 + index * AGG_KEY_ROW_H
  const cy = y + 8
  const x = AGG_KEY_X + 42

  return (
    <g>
      {index > 0 && (
        <line
          x1={AGG_KEY_X}
          y1={y - 4}
          x2={AGG_KEY_X + AGG_KEY_W}
          y2={y - 4}
          stroke={C.mediumGray}
          strokeWidth={0.35}
          opacity={0.45}
        />
      )}
      <text
        x={AGG_KEY_X + 10}
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
      <KeySegment
        x={x}
        y={y}
        w={52}
        label={entry.step}
        fill={TINT.semantic}
        stroke={C.teal}
        color={C.darkTeal}
        size={7.2}
        opacity={0.68}
      />
      <KeySegment
        x={x + 57}
        y={y}
        w={48}
        label={`packed=${entry.packed}`}
        fill={TINT.error}
        stroke={C.poppy}
        color={C.poppy}
        size={6}
      />
      <text
        x={x + 116}
        y={cy}
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={6.8}
        fontWeight={600}
        fill={C.darkGray}
        opacity={0.65}
      >
        {entry.size}
      </text>
    </g>
  )
}

function AggregateKeys() {
  return (
    <g>
      {AGG_ENTRIES.map((entry, index) => (
        <AggregateKeyRow key={entry.hashOrd} entry={entry} index={index} />
      ))}
      <SectionTitle x={AGG_KEY_X + AGG_KEY_W / 2} y={AGG_ORD_Y + AGG_ORD_H + 10} size={6.6}>
        KEYS
      </SectionTitle>
    </g>
  )
}

function AggregateOrdinals() {
  return (
    <g>
      <SectionTitle x={AGG_ORD_X + AGG_ORD_W / 2} y={AGG_ORD_Y + AGG_ORD_H + 10} size={6.6}>
        ORDINALS
      </SectionTitle>
      <rect
        x={AGG_ORD_X}
        y={AGG_ORD_Y}
        width={AGG_ORD_W}
        height={AGG_ORD_H}
        rx={4}
        fill={C.lightGray}
        stroke={C.mediumGray}
        strokeWidth={1}
      />
      {AGG_ENTRIES.map((entry, index) => {
        const y = AGG_ORD_Y + index * AGG_ORD_CELL_H
        return (
          <g key={entry.hashOrd}>
            {index > 0 && (
              <line x1={AGG_ORD_X} y1={y} x2={AGG_ORD_X + AGG_ORD_W} y2={y} stroke={C.mediumGray} strokeWidth={0.4} opacity={0.65} />
            )}
            <text
              x={AGG_ORD_X + AGG_ORD_W / 2}
              y={y + AGG_ORD_CELL_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={7.2}
              fontWeight={750}
              fill={C.darkGray}
            >
              {entry.hashOrd}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function AggregateStates() {
  return (
    <g>
      {AGG_ENTRIES.map((entry, index) => {
        const y = AGG_ORD_Y + index * AGG_ORD_CELL_H + (AGG_ORD_CELL_H - STATE_H) / 2
        return (
          <g key={entry.state}>
            <line
              x1={AGG_ORD_X + AGG_ORD_W + 8}
              y1={y + STATE_H / 2}
              x2={STATE_X - 8}
              y2={y + STATE_H / 2}
              stroke={C.mediumGray}
              strokeWidth={1}
              markerEnd="url(#mk-gray-small)"
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
              fontSize={fitMono(entry.state, STATE_W, 8, 4.8)}
              fontWeight={700}
              fill={C.pink}
            >
              {entry.state}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export function Figure16CopyNoPacking() {
  return (
    <Figure
      number="16 COPY"
      title="Packed labels: compact bytes feed BlockHash"
      subtitle="Before aggregation, label columns are packed into one BytesRef block. The aggregate key is step plus packed dimensions, instead of repeating every label block in the composite key."
      width={W}
      height={TOTAL_H}
    >
      <defs>
        <marker
          id="mk-gray-small"
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="4.5"
          markerHeight="4.5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={C.darkGray} />
        </marker>
      </defs>

      <GroupLabel x={INPUT_X0} y={INPUT_TOP - 22}>
        INPUT PAGE
      </GroupLabel>
      <PageStack x={INPUT_PAGE_X} y={INPUT_PAGE_Y} w={INPUT_PAGE_W} h={INPUT_PAGE_H} />
      {INPUT_COLS.map((col, index) => (
        <InputBlock
          key={col.field}
          x={inputX(index)}
          y={INPUT_TOP}
          w={col.w}
          h={INPUT_H}
          hdr={INPUT_HDR}
          cell={INPUT_CELL}
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

      <line x1={W / 2} y1={INPUT_TOP + INPUT_H + 12} x2={W / 2} y2={PACK_TOP - 10} stroke={C.darkGray} strokeWidth={1.4} markerEnd="url(#mk-gray)" />

      <PackedPage />

      <line x1={W / 2} y1={PACK_TOP + PACK_H + 12} x2={W / 2} y2={AGG_FRAME_Y - 10} stroke={C.darkGray} strokeWidth={1.4} markerEnd="url(#mk-gray)" />

      <ContextFrame x={AGG_FRAME_X} y={AGG_FRAME_Y} w={AGG_FRAME_W} h={AGG_FRAME_H} color={C.darkGray} />
      <GroupLabel x={INPUT_X0} y={AGG_LABEL_Y}>
        AGGREGATE
      </GroupLabel>

      <ContextFrame
        x={AGG_BLOCKHASH_X}
        y={AGG_BLOCKHASH_Y}
        w={AGG_BLOCKHASH_W}
        h={AGG_BLOCKHASH_H}
        color={C.teal}
      />
      <SectionTitle x={AGG_BLOCKHASH_X + AGG_BLOCKHASH_W / 2} y={AGG_BLOCKHASH_Y + 14} color={C.darkTeal}>
         HASH(step, HASH(_packed))
      </SectionTitle>
      <AggregateKeys />
      <line
        x1={AGG_KEY_X + AGG_KEY_W + 16}
        y1={AGG_KEY_Y + AGG_KEY_H / 2}
        x2={AGG_ORD_X - 10}
        y2={AGG_KEY_Y + AGG_KEY_H / 2}
        stroke={C.mediumGray}
        strokeWidth={0.9}
        markerEnd="url(#mk-gray-small)"
      />
      <AggregateOrdinals />
      <AggregateStates />
    </Figure>
  )
}
