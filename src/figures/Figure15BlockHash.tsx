import { Figure } from "../diagram/Figure"
import { Node, Arrow, Boundary, Annotation, GroupLabel } from "../diagram/grammar"
import { C, TINT, FONT_MONO } from "../diagram/palette"

// FIGURE 15 — BlockHash: column values mapped to dense group IDs.
// Demonstrates single-column GROUP BY (pod_id INT). BlockHash maintains an
// internal hash table: each distinct value gets a dense integer ordinal.
// Ordinals index directly into flat accumulator arrays — no map traversal.

const INPUT_VALS = ["1", "1", "2", "2", "3", "3"]
const GROUP_IDS  = [0,   0,   1,   1,   2,   2  ]

// group 0 = blue, 1 = teal, 2 = muted gray
const GRP_FILL   = [TINT.physical, TINT.semantic, TINT.muted]
const GRP_STROKE = [C.elasticBlue, C.teal,        C.mediumGray]
const GRP_COLOR  = [C.darkBlue,    C.darkTeal,    C.darkGray   ]

const N = INPUT_VALS.length
const CELL_H = 36, HDR_H = 30
const BLOCK_H = HDR_H + N * CELL_H   // 246
const BY = 74                         // block top y

// x positions
const IBX = 20,  IBW = 120            // input block
const BHX = 162, BHW = 286            // BlockHash node
const OBX = 470, OBW = 120            // output group-ID block
const AX  = 614                       // accumulators x-start
const AW  = 326                       // accumulators total width (to 940)
const LABEL_W = 56                    // accumulator name column width
const CELL_W = (AW - LABEL_W) / 3    // per-group cell width ≈ 90

const ACC = [
  { name: "sum[]",   vals: ["85.1", "25.7", "153.9"] },
  { name: "count[]", vals: ["2",    "2",    "2"     ] },
  { name: "min[]",   vals: ["42.1", "12.5", "76.1"  ] },
]

// Hash table rows shown
const HT = [
  { key: "1", ord: "0" },
  { key: "2", ord: "1" },
  { key: "3", ord: "2" },
]

function ColBlock({
  x, y, w, hdrH, cellH, typeName, fieldName,
  vals, color, stroke, fill,
  cellFill,
}: {
  x: number; y: number; w: number; hdrH: number; cellH: number
  typeName: string; fieldName: string; vals: (string | number)[]
  color: string; stroke: string; fill: string
  cellFill?: string[]
}) {
  const n = vals.length
  const h = hdrH + n * cellH
  return (
    <g>
      {/* type badge */}
      <rect x={x} y={y - 21} width={w} height={17} rx={4}
        fill={fill} stroke={stroke} strokeWidth={1} />
      <text x={x + w / 2} y={y - 12}
        textAnchor="middle" dominantBaseline="central"
        fontFamily={FONT_MONO} fontSize={9} fontWeight={700} fill={color}>
        {typeName}
      </text>
      {/* outer border */}
      <rect x={x} y={y} width={w} height={h}
        rx={4} fill="none" stroke={stroke} strokeWidth={1.5} />
      {/* header */}
      <rect x={x} y={y} width={w} height={hdrH} fill={fill} />
      <line x1={x} y1={y + hdrH} x2={x + w} y2={y + hdrH}
        stroke={stroke} strokeWidth={0.75} />
      <text x={x + w / 2} y={y + hdrH / 2}
        textAnchor="middle" dominantBaseline="central"
        fontFamily={FONT_MONO} fontSize={9} fontWeight={600} fill={color}>
        {fieldName}
      </text>
      {/* cells */}
      {vals.map((v, ri) => {
        const cy = y + hdrH + ri * cellH
        const cf = cellFill ? cellFill[ri] : undefined
        return (
          <g key={ri}>
            {ri > 0 && (
              <line x1={x} y1={cy} x2={x + w} y2={cy}
                stroke={stroke} strokeWidth={0.35} opacity={0.5} />
            )}
            {cf && (
              <rect x={x} y={cy} width={w} height={cellH} fill={cf} opacity={0.75} />
            )}
            <text x={x + w / 2} y={cy + cellH / 2}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={13} fontWeight={600} fill={color}>
              {String(v)}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export function Figure15BlockHash() {
  const nodeCY = BY + 28   // BlockHash node center y

  return (
    <Figure
      number="15"
      title="BlockHash: column values to dense group IDs"
      subtitle="BlockHash maintains an internal hash table mapping each distinct column value to a dense integer ordinal (group ID). Per-row lookup is O(1). Ordinals directly index into flat GroupingAggregator arrays — no map traversal, no pointer chasing, cache-sequential updates."
      width={960}
      height={470}
    >
      {/* ── LEFT: input IntBlock ─────────────────────────────────── */}
      <GroupLabel x={IBX} y={BY - 30}>INPUT PAGE</GroupLabel>

      <ColBlock x={IBX} y={BY} w={IBW} hdrH={HDR_H} cellH={CELL_H}
        typeName="IntBlock" fieldName="pod_id [INT32]"
        vals={INPUT_VALS}
        color={C.darkBlue} stroke={C.elasticBlue} fill={TINT.physical} />

      {/* ── Arrow: input → BlockHash ─── */}
      <Arrow x1={IBX + IBW + 8} y1={nodeCY}
             x2={BHX - 6}       y2={nodeCY} variant="physical" />

      {/* ── CENTER: BlockHash node + hash table ──────────────────── */}
      <GroupLabel x={BHX} y={BY - 30}>BLOCKHASH — per-row lookup</GroupLabel>

      <Node x={BHX} y={BY} w={BHW} h={56}
        label="BlockHash"
        sub="one hash-table lookup per row → assigns ordinal"
        variant="physical" />

      {/* Hash table boundary */}
      <Boundary x={BHX} y={BY + 70} w={BHW} h={170}
        label="HASH TABLE (LongHash — key = int64 · ordinal = int32)" color={C.teal} />

      {/* header labels */}
      <text x={BHX + 20} y={BY + 70 + 30}
        dominantBaseline="central" fontSize={10} fontWeight={600} fill={C.teal}>
        key value (8 B)
      </text>
      <text x={BHX + BHW - 20} y={BY + 70 + 30}
        textAnchor="end" dominantBaseline="central" fontSize={10} fontWeight={600} fill={C.teal}>
        ordinal (4 B)
      </text>

      {HT.map((entry, i) => {
        const ey = BY + 70 + 52 + i * 38
        return (
          <g key={i}>
            <rect x={BHX + 14} y={ey - 13} width={BHW - 28} height={28} rx={4}
              fill={GRP_FILL[i]} stroke={GRP_STROKE[i]} strokeWidth={0.75} />
            <text x={BHX + 28} y={ey + 1} dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={13} fontWeight={700} fill={GRP_COLOR[i]}>
              {entry.key}
            </text>
            <text x={BHX + BHW - 28} y={ey + 1} textAnchor="end"
              dominantBaseline="central" fontFamily={FONT_MONO}
              fontSize={13} fontWeight={700} fill={GRP_COLOR[i]}>
              grp {entry.ord}
            </text>
          </g>
        )
      })}

      <Annotation x={BHX + BHW / 2} y={BY + 70 + 170 + 16} size={10}>
        key = 8 B int64 &nbsp;·&nbsp; ordinal = 4 B int32 &nbsp;·&nbsp; N distinct values = N accumulator slots
      </Annotation>

      {/* ── Arrow: BlockHash → group-ID block ─── */}
      <Arrow x1={BHX + BHW + 8} y1={nodeCY}
             x2={OBX - 6}       y2={nodeCY} variant="physical" />

      {/* ── Group-ID block ────────────────────────────────────────── */}
      <GroupLabel x={OBX} y={BY - 30}>PER-ROW GROUP ID</GroupLabel>

      <ColBlock x={OBX} y={BY} w={OBW} hdrH={HDR_H} cellH={CELL_H}
        typeName="IntBlock" fieldName="group_id [INT32]"
        vals={GROUP_IDS.map(String)}
        color={C.ink} stroke={C.mediumGray} fill={C.lightGray}
        cellFill={GROUP_IDS.map(gid => GRP_FILL[gid])} />

      {/* ── Arrow: group-ID → accumulators ─── */}
      <Arrow x1={OBX + OBW + 8} y1={BY + BLOCK_H / 2}
             x2={AX - 6}        y2={BY + BLOCK_H / 2} variant="logical" />

      {/* ── Accumulator arrays ────────────────────────────────────── */}
      <GroupLabel x={AX} y={BY - 30}>ACCUMULATOR ARRAYS — direct-indexed by group_id</GroupLabel>

      {/* group-index header cells */}
      {[0, 1, 2].map(gi => (
        <g key={gi}>
          <rect x={AX + LABEL_W + gi * CELL_W} y={BY - 16}
            width={CELL_W} height={14} rx={3}
            fill={GRP_FILL[gi]} stroke={GRP_STROKE[gi]} strokeWidth={0.75} />
          <text x={AX + LABEL_W + gi * CELL_W + CELL_W / 2} y={BY - 9}
            textAnchor="middle" dominantBaseline="central"
            fontFamily={FONT_MONO} fontSize={8} fontWeight={600} fill={GRP_COLOR[gi]}>
            grp {gi}
          </text>
        </g>
      ))}

      {ACC.map((acc, ai) => {
        const ay = BY + ai * 72
        return (
          <g key={ai}>
            {/* array name */}
            <text x={AX + LABEL_W - 4} y={ay + 22}
              textAnchor="end" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={10} fontWeight={600} fill={C.ink}>
              {acc.name}
            </text>
            {/* 3 group cells */}
            {acc.vals.map((v, gi) => {
              const cx = AX + LABEL_W + gi * CELL_W
              return (
                <g key={gi}>
                  <rect x={cx} y={ay} width={CELL_W} height={46} rx={4}
                    fill={GRP_FILL[gi]} stroke={GRP_STROKE[gi]} strokeWidth={0.75} />
                  <text x={cx + CELL_W / 2} y={ay + 23}
                    textAnchor="middle" dominantBaseline="central"
                    fontFamily={FONT_MONO} fontSize={12} fontWeight={600} fill={GRP_COLOR[gi]}>
                    {v}
                  </text>
                </g>
              )
            })}
          </g>
        )
      })}

      <Annotation x={AX + AW / 2} y={BY + ACC.length * 72 + 20} size={10} color={C.darkTeal}>
        O(1) update per row — accumulators[group_id] += value; no map traversal
      </Annotation>
    </Figure>
  )
}
