import {
  BlockPage,
  C,
  CompositeKeyTable,
  Figure,
  GroupLabel,
  OrdinalVector,
  rowWidth,
  SectionTitle,
  StateColumn,
  TINT,
} from "../share"

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
    w: 184,
    color: C.darkGray,
    stroke: C.darkGray,
    fill: C.white,
    valueSize: 8,
  },
  {
    field: "region",
    blockType: "Block$OrdinalByteRef",
    values: ROWS.map((r) => r.region),
    w: 116,
    color: C.darkGray,
    stroke: C.darkGray,
    fill: C.white,
    valueSize: 8.5,
  },
] as const

const INPUT_ITEMS = [
  INPUT_COLS[0],
  INPUT_COLS[1],
  INPUT_COLS[2],
  { kind: "ellipsis", w: 34 },
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

const HASH_TOP = INPUT_TOP + INPUT_H + 74

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
const AGG_LABEL_Y = AGG_FRAME_Y - 12
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

function CompositeKeyBlocks() {
  const rows = HASH_ENTRIES.map((entry, index) => {
    const x = KEY_X + 42
    return {
      id: entry.ord,
      label: `KEY ${index + 1}:`,
      segments: [
        {
          x,
          w: 48,
          label: entry.step,
          fill: TINT.semantic,
          stroke: C.teal,
          color: C.darkTeal,
          size: 7.2,
          opacity: 0.68,
        },
        {
          x: x + 51,
          w: 42,
          label: entry.podKey,
          fill: TINT.physical,
          stroke: C.elasticBlue,
          color: C.darkBlue,
          size: 7.2,
          opacity: 0.68,
        },
        {
          x: x + 96,
          w: 106,
          label: entry.svc,
          fill: C.lightGray,
          stroke: C.mediumGray,
          color: C.darkGray,
          size: 6.6,
        },
        {
          x: x + 221,
          w: 54,
          label: entry.region,
          fill: C.lightGray,
          stroke: C.mediumGray,
          color: C.darkGray,
          size: 6.4,
        },
      ],
      ellipsisX: x + 211,
      tag: {
        x: x + 282,
        text: entry.byteTag,
      },
    }
  })

  return (
    <CompositeKeyTable
      x={KEY_X}
      y={KEY_Y}
      w={KEY_W}
      rowH={KEY_ROW_H}
      rows={rows}
      labelY={ORD_Y + ORD_H + 10}
    />
  )
}

function OrdinalsVector() {
  return (
    <OrdinalVector
      x={ORD_X}
      y={ORD_Y}
      w={ORD_W}
      cellHeight={ORD_CELL_H}
      values={HASH_ENTRIES.map((entry) => entry.ord)}
      label="ORDINALS"
      labelY={ORD_Y + ORD_H + 10}
      labelSize={6.6}
    />
  )
}

function GroupStates() {
  return (
    <StateColumn
      x={STATE_X}
      y={ORD_Y}
      w={STATE_W}
      h={STATE_H}
      cellHeight={ORD_CELL_H}
      sourceX={ORD_X + ORD_W + 8}
      states={HASH_ENTRIES.map((_, index) => `GroupingState$${index}`)}
    />
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
        y1={inputBottom + 12}
        x2={W / 2}
        y2={HASH_TOP - 10}
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
        x={BLOCK_HASH_FRAME_X}
        y={BLOCK_HASH_FRAME_Y}
        w={BLOCK_HASH_FRAME_W}
        h={BLOCK_HASH_FRAME_H}
        inset
      />
      <SectionTitle
        x={BLOCK_HASH_FRAME_X + BLOCK_HASH_FRAME_W / 2}
        y={BLOCK_HASH_FRAME_Y + 14}
        color={C.darkTeal}
        size={8.8}
      >
        <tspan fill={C.darkTeal}>HASH(</tspan>
        <tspan fill={C.darkTeal} fillOpacity={0.68}>step, pod_id, service, ..., region</tspan>
        <tspan fill={C.darkTeal}>)</tspan>
      </SectionTitle>
      <CompositeKeyBlocks />

      <line
        x1={arrowX1}
        y1={arrowY}
        x2={arrowX2}
        y2={arrowY}
        stroke={C.mediumGray}
        strokeWidth={0.9}
        markerEnd="url(#mk-gray)"
      />

      <OrdinalsVector />
      <GroupStates />
    </Figure>
  )
}
