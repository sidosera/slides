import {
  BlockPage,
  C,
  CompositeKeyTable,
  Figure,
  FONT_MONO,
  GroupLabel,
  OrdinalVector,
  rowWidth,
  SectionTitle,
  StateColumn,
  TINT,
} from "../share"

// FIGURE 16 COPY — Packed dimension bytes feeding BlockHash aggregation.

const W = 960

const SVC_NGINX_WEST = "nginx-proxy.us-west-1"
const SVC_API_EAST = "api-gate.us-east-1"

const ROWS = [
  {
    step: "1000 s",
    pod: "1",
    svc: SVC_NGINX_WEST,
    region: "us-west-1",
    packed: "p0",
  },
  {
    step: "1000 s",
    pod: "2",
    svc: SVC_API_EAST,
    region: "us-east-1",
    packed: "p1",
  },
  {
    step: "1060 s",
    pod: "1",
    svc: SVC_NGINX_WEST,
    region: "us-west-1",
    packed: "p0",
  },
  {
    step: "1060 s",
    pod: "2",
    svc: SVC_API_EAST,
    region: "us-east-1",
    packed: "p1",
  },
]

const PACKED_VALUES = [
  {
    packed: "p0",
    podKey: "pod=1",
    svc: SVC_NGINX_WEST,
    region: "us-west-1",
    size: "56b",
  },
  {
    packed: "p1",
    podKey: "pod=2",
    svc: SVC_API_EAST,
    region: "us-east-1",
    size: "56b",
  },
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
    values: ROWS.map((r) => r.step),
    w: 88,
    color: C.darkTeal,
    stroke: C.teal,
    fill: TINT.semantic,
    valueSize: 10,
  },
  {
    field: "pod_id",
    blockType: "Block$I32",
    values: ROWS.map((r) => r.pod),
    w: 72,
    color: C.darkBlue,
    stroke: C.elasticBlue,
    fill: TINT.physical,
    valueSize: 11,
  },
  {
    field: "service",
    blockType: "Block$OrdinalByteRef",
    values: ROWS.map((r) => r.svc),
    w: 220,
    color: C.mutedInk,
    stroke: C.darkGray,
    fill: C.white,
    valueSize: 8.7,
  },
  {
    field: "region",
    blockType: "Block$OrdinalByteRef",
    values: ROWS.map((r) => r.region),
    w: 126,
    color: C.mutedInk,
    stroke: C.darkGray,
    fill: C.white,
    valueSize: 9.2,
  },
] as const

const INPUT_ITEMS = [
  INPUT_COLS[0],
  INPUT_COLS[1],
  INPUT_COLS[2],
  { kind: "ellipsis", w: 26 },
  INPUT_COLS[3],
] as const

const INPUT_TOP = 74
const INPUT_HDR = 30
const INPUT_CELL = 30
const INPUT_H = INPUT_HDR + ROWS.length * INPUT_CELL
const INPUT_GAP = 14
const INPUT_TOTAL_W = rowWidth(INPUT_ITEMS, INPUT_GAP)
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
const PACK_ITEMS = [
  {
    field: "step",
    blockType: "Block$I64",
    values: ROWS.map((r) => r.step),
    w: PACK_STEP_W,
    color: C.darkTeal,
    stroke: C.teal,
    fill: TINT.semantic,
    valueSize: 8.2,
  },
  {
    field: "_packed",
    blockType: "Block$BytesRef",
    values: ROWS.map((r) => r.packed),
    w: PACK_ORD_W,
    color: C.poppy,
    stroke: C.poppy,
    fill: TINT.error,
    valueSize: 7.2,
  },
] as const
const PACK_BLOCKS_W = rowWidth(PACK_ITEMS, PACK_GAP)
const PACK_HASH_W = 330
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
const AGG_KEY_W = 240
const AGG_KEY_H = 126
const AGG_KEY_ROW_H = 26

const AGG_ORD_X = AGG_KEY_X + AGG_KEY_W + 78
const AGG_ORD_Y = AGG_KEY_Y + 16
const AGG_ORD_W = 36
const AGG_ORD_CELL_H = 25
const AGG_ORD_H = AGG_ENTRIES.length * AGG_ORD_CELL_H

const AGG_BLOCKHASH_X = AGG_KEY_X - 8
const AGG_BLOCKHASH_Y = AGG_KEY_Y - 16
const AGG_BLOCKHASH_W = AGG_ORD_X + AGG_ORD_W - AGG_BLOCKHASH_X + 10
const AGG_BLOCKHASH_H = AGG_KEY_H + 32

const STATE_X = INPUT_PAGE_X + INPUT_PAGE_W - 18 - 128
const STATE_W = 128
const STATE_H = 18

const TOTAL_H = AGG_FRAME_Y + AGG_FRAME_H + 28
const CONTEXT_FILL = "rgba(247,249,252,0.62)"
const CONTEXT_STROKE = "#edf1f6"
const INSET_STROKE = "#dfe5ee"

function SoftFrame({
  x,
  y,
  w,
  h,
  inset,
}: {
  x: number
  y: number
  w: number
  h: number
  inset?: boolean
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill={inset ? "none" : CONTEXT_FILL}
      stroke={inset ? INSET_STROKE : CONTEXT_STROKE}
      strokeWidth={0.85}
    />
  )
}

function PackedPage() {
  return (
    <g>
      <GroupLabel x={INPUT_X0} y={PACK_TOP - 22}>
        PACKING
      </GroupLabel>
      <BlockPage
        pageX={PACK_PAGE_X}
        pageY={PACK_PAGE_Y}
        pageW={PACK_PAGE_W}
        pageH={PACK_PAGE_H}
        blockX={PACK_STEP_X}
        blockY={PACK_TOP}
        blockH={PACK_H}
        headerHeight={PACK_HDR}
        cellHeight={PACK_CELL}
        gap={PACK_GAP}
        items={PACK_ITEMS}
        softFrame
      />
      <line
        x1={PACK_ORD_X + PACK_ORD_W + 8}
        y1={PACK_TOP + PACK_H / 2}
        x2={PAGE_HASH_X - 8}
        y2={PACK_TOP + PACK_H / 2}
        stroke={C.mediumGray}
        strokeWidth={0.9}
        opacity={0.68}
        markerEnd="url(#mk-gray-small)"
      />
      <PackedValuesTable />
    </g>
  )
}

function PackedValuesTable() {
  return (
    <g>
      <rect
        x={PAGE_HASH_X}
        y={PAGE_HASH_Y}
        width={PACK_HASH_W}
        height={PAGE_HASH_H}
        fill="rgba(255,255,255,0.78)"
        stroke="rgba(250,116,78,0.68)"
        strokeWidth={0.85}
      />
      <rect
        x={PAGE_HASH_X}
        y={PAGE_HASH_Y}
        width={PACK_HASH_W}
        height={22}
        fill="rgba(250,116,78,0.055)"
        stroke="none"
      />
      <text
        x={PAGE_HASH_X + PACK_HASH_W / 2}
        y={PAGE_HASH_Y + 11}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={8.6}
        fontWeight={700}
        fill={C.poppy}
        letterSpacing={0.5}
      >
        Block$OrdinalByteRef.Dict
      </text>
      <CompositeKeyTable
        x={PAGE_HASH_X}
        y={PAGE_HASH_Y + 14}
        w={PACK_HASH_W}
        rowH={24}
        chipH={16}
        label=""
        rowLabelSize={7.2}
        tagSize={7.2}
        ellipsisSize={10}
        rows={PACKED_VALUES.map((entry) => ({
          id: entry.packed,
          label: entry.packed,
          segments: [
            {
              x: PAGE_HASH_X + 34,
              w: 48,
              h: 16,
              label: entry.podKey,
              fill: TINT.physical,
              stroke: C.elasticBlue,
              color: C.darkBlue,
              opacity: 0.85,
            },
            {
              x: PAGE_HASH_X + 88,
              w: 116,
              h: 16,
              label: entry.svc,
              fill: C.lightGray,
              stroke: C.mediumGray,
              color: C.mutedInk,
              size: 7.1,
            },
            {
              x: PAGE_HASH_X + 226,
              w: 58,
              h: 16,
              label: entry.region,
              fill: C.lightGray,
              stroke: C.mediumGray,
              color: C.mutedInk,
              size: 6.9,
            },
          ],
          ellipsisX: PAGE_HASH_X + 214,
          tag: {
            x: PAGE_HASH_X + 296,
            text: entry.size,
          },
        }))}
      />
    </g>
  )
}

function AggregateKeys() {
  const rows = AGG_ENTRIES.map((entry, index) => {
    const x = AGG_KEY_X + 42
    return {
      id: entry.hashOrd,
      label: `KEY ${index + 1}:`,
      segments: [
        {
          x,
          w: 58,
          h: 16,
          label: entry.step,
          fill: TINT.semantic,
          stroke: C.teal,
          color: C.darkTeal,
          size: 8.1,
          opacity: 0.88,
        },
        {
          x: x + 64,
          w: 62,
          h: 16,
          label: `packed=${entry.packed}`,
          fill: TINT.error,
          stroke: C.poppy,
          color: C.poppy,
          size: 7.2,
        },
      ],
      tag: {
        x: x + 140,
        text: entry.size,
      },
    }
  })

  return (
    <CompositeKeyTable
      x={AGG_KEY_X}
      y={AGG_KEY_Y}
      w={AGG_KEY_W}
      rowH={AGG_KEY_ROW_H}
      chipH={16}
      rows={rows}
      labelY={AGG_ORD_Y + AGG_ORD_H + 10}
    />
  )
}

function AggregateOrdinals() {
  return (
    <OrdinalVector
      x={AGG_ORD_X}
      y={AGG_ORD_Y}
      w={AGG_ORD_W}
      cellHeight={AGG_ORD_CELL_H}
      values={AGG_ENTRIES.map((entry) => entry.hashOrd)}
      label="ORDINALS"
      labelY={AGG_ORD_Y + AGG_ORD_H + 10}
      labelSize={6.6}
    />
  )
}

function AggregateStates() {
  return (
    <StateColumn
      x={STATE_X}
      y={AGG_ORD_Y}
      w={STATE_W}
      h={STATE_H}
      cellHeight={AGG_ORD_CELL_H}
      sourceX={AGG_ORD_X + AGG_ORD_W + 8}
      marker="mk-gray-small"
      states={AGG_ENTRIES.map((entry) => entry.state)}
    />
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
      <BlockPage
        pageX={INPUT_PAGE_X}
        pageY={INPUT_PAGE_Y}
        pageW={INPUT_PAGE_W}
        pageH={INPUT_PAGE_H}
        blockX={INPUT_X0}
        blockY={INPUT_TOP}
        blockH={INPUT_H}
        headerHeight={INPUT_HDR}
        cellHeight={INPUT_CELL}
        gap={INPUT_GAP}
        items={INPUT_ITEMS}
        softFrame
      />

      <line
        x1={W / 2}
        y1={INPUT_TOP + INPUT_H + 12}
        x2={W / 2}
        y2={PACK_TOP - 10}
        stroke={C.darkGray}
        strokeWidth={1.1}
        opacity={0.68}
        markerEnd="url(#mk-gray)"
      />

      <PackedPage />

      <line
        x1={W / 2}
        y1={PACK_TOP + PACK_H + 12}
        x2={W / 2}
        y2={AGG_FRAME_Y - 10}
        stroke={C.darkGray}
        strokeWidth={1.1}
        opacity={0.68}
        markerEnd="url(#mk-gray)"
      />

      <SoftFrame
        x={AGG_FRAME_X}
        y={AGG_FRAME_Y}
        w={AGG_FRAME_W}
        h={AGG_FRAME_H}
      />
      <GroupLabel x={INPUT_X0} y={AGG_LABEL_Y}>
        AGGREGATE
      </GroupLabel>

      <SoftFrame
        x={AGG_BLOCKHASH_X}
        y={AGG_BLOCKHASH_Y}
        w={AGG_BLOCKHASH_W}
        h={AGG_BLOCKHASH_H}
        inset
      />
      <SectionTitle
        x={AGG_BLOCKHASH_X + AGG_BLOCKHASH_W / 2}
        y={AGG_BLOCKHASH_Y + 14}
        color={C.darkTeal}
        size={8.8}
      >
        <tspan fill={C.darkTeal}>HASH(</tspan>
        <tspan fill={C.darkTeal} fillOpacity={0.68}>step, </tspan>
        <tspan fill={C.darkTeal}>HASH(</tspan>
        <tspan fill={C.darkTeal} fillOpacity={0.68}>_packed</tspan>
        <tspan fill={C.darkTeal}>)</tspan>
        <tspan fill={C.darkTeal}>)</tspan>
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
