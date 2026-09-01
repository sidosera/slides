import { Figure } from "../share"
import { C, TINT, FONT_MONO } from "../share"

// FIGURE 13b — Columnar representation: tabular concept → dense column arrays.
// Layout: row table on top, per-column down-arrows, column blocks directly below.
// Each column lands under its table header so the pivot reads spatially.

const W = 960

const ROWS = [
  { pod: "1", ts: "t₀", val: "0.42", svc: "nginx-proxy.us-west-1" },
  { pod: "1", ts: "t₁", val: "1.70", svc: "nginx-proxy.us-east-1" },
  { pod: "2", ts: "t₀", val: "0.90", svc: "api-gate.us-east-1" },
  { pod: "3", ts: "t₀", val: "0.30", svc: "api-gate.us-east-1" },
  { pod: "3", ts: "t₁", val: "2.10", svc: "api-gate.us-west-1" },
]

type RowKey = keyof typeof ROWS[number]
type ColumnSpec = {
  field: string
  key: RowKey
  color: string
  stroke: string
  fill: string
  blockType: string
  secondaryBlockType?: string
  marker: string
  offsetHit: number
  hitW: number
}

const COLS: readonly ColumnSpec[] = [
  {
    field: "pod_id",
    key: "pod" as const,
    color: C.darkBlue,
    stroke: C.elasticBlue,
    fill: TINT.physical,
    blockType: "Block$I32",
    marker: "mk-blue",
    offsetHit: 18,
    hitW: 14,
  },
  {
    field: "timestamp",
    key: "ts" as const,
    color: C.darkTeal,
    stroke: C.teal,
    fill: TINT.semantic,
    blockType: "Block$I64",
    marker: "mk-teal",
    offsetHit: 18,
    hitW: 14,
  },
  {
    field: "value",
    key: "val" as const,
    color: C.pink,
    stroke: C.lightPink,
    fill: TINT.value,
    blockType: "Block$Double",
    marker: "mk-pink",
    offsetHit: 18,
    hitW: 14,
  },
  {
    field: "service",
    key: "svc" as const,
    color: C.mutedInk,
    stroke: C.darkGray,
    fill: C.white,
    blockType: "Block$OrdinalByteRef",
    offsetHit: 18,
    hitW: 14,
    marker: "mk-gray",
  },
]

// ── shared column geometry ────────────────────────────────────────────────────
// Service column is wider to hold encoding diagram content within table bounds.
const COL_WIDTHS = [100, 100, 100, 350] as const
const COL_GAP = 14
const TOTAL_W =
  COL_WIDTHS.reduce((a, b) => a + b, 0) + (COL_WIDTHS.length - 1) * COL_GAP // 692
const X0 = Math.round((W - TOTAL_W) / 2) // 134

const colX = (ci: number): number =>
  ci === 0 ? X0 : colX(ci - 1) + COL_WIDTHS[ci - 1] + COL_GAP
const colCX = (ci: number) => colX(ci) + COL_WIDTHS[ci] / 2

// ── row table ─────────────────────────────────────────────────────────────────
const TBL_TOP = 68
const TBL_HDR = 38
const ROW_H = 30
const TBL_H = TBL_HDR + ROWS.length * ROW_H
const TBL_BOT = TBL_TOP + TBL_H

// ── arrow zone ────────────────────────────────────────────────────────────────
const ARR_TOP = TBL_BOT + 12 // 294
const ARR_BOT = ARR_TOP + 44 // 338

// ── column blocks ─────────────────────────────────────────────────────────────
const BLK_TOP = ARR_BOT // 338
const BLK_HDR = 30
const BLK_CH = 36
const BLK_H = BLK_HDR + ROWS.length * BLK_CH // 198
const BLK_BOT = BLK_TOP + BLK_H // 536

// ── bottom property panels ────────────────────────────────────────────────────
const PROP_TOP = BLK_BOT + 36 // 572
const PROP_H = 104
const PROP_PAD = 20
const PROP_W = (W - 2 * PROP_PAD - 2 * 14) / 3

const TOTAL_H = PROP_TOP + PROP_H + 24
const CONTEXT_FILL = "rgba(247,249,252,0.62)"
const CONTEXT_STROKE = "#edf1f6"
const PANEL_STROKE = "#dfe5ee"
const CAPTION = C.faintInk

export function Figure13bColumnar() {
  return (
    <Figure
      number="13b"
      title="Columnar representation"
      subtitle="The same five rows shown twice. Row storage puts each row contiguous in memory. Columnar storage puts each field contiguous — the physical layout inside an ESQL Page."
      width={W}
      height={TOTAL_H}
    >
      {/* per-column arrowhead markers */}
      <defs>
        <marker
          id="mk-pink"
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={C.lightPink} />
        </marker>
      </defs>
      {/* ══════════════════════════════════════════════════════════════
          LABEL: logical table
      ══════════════════════════════════════════════════════════════ */}
      <text
        x={X0 + TOTAL_W / 2}
        y={TBL_TOP - 14}
        textAnchor="middle"
        fontSize={12.5}
        fontWeight={760}
        fill={C.ink}
        letterSpacing={1}
      >
        LOGICAL
      </text>

      {/* ── outer table border ── */}
      <rect
        x={X0}
        y={TBL_TOP}
        width={TOTAL_W}
        height={TBL_H}
        fill="rgba(255,255,255,0.86)"
        stroke={PANEL_STROKE}
        strokeWidth={0.85}
      />

      {/* clip header fills to the table's rounded border */}
      <defs>
        <clipPath id="tbl-hdr-clip">
          <rect x={X0} y={TBL_TOP} width={TOTAL_W} height={TBL_HDR} />
        </clipPath>
      </defs>

      {/* ── column headers ── */}
      <g clipPath="url(#tbl-hdr-clip)">
        {COLS.map((col, ci) => {
          const cx = colX(ci)
          const fillW =
            ci < COLS.length - 1 ? COL_WIDTHS[ci] + COL_GAP : COL_WIDTHS[ci]
          return (
            <rect
              key={ci}
              x={cx}
              y={TBL_TOP}
              width={fillW}
              height={TBL_HDR}
              fill={col.fill}
              stroke="none"
            />
          )
        })}
      </g>

      {COLS.map((col, ci) => {
        const cx = colX(ci)
        return (
          <g key={ci}>
            {ci > 0 && (
              <line
                x1={cx}
                y1={TBL_TOP}
                x2={cx}
                y2={TBL_BOT}
                stroke={PANEL_STROKE}
                strokeWidth={0.45}
                opacity={0.72}
              />
            )}
            <line
              x1={X0}
              y1={TBL_TOP + TBL_HDR}
              x2={X0 + TOTAL_W}
              y2={TBL_TOP + TBL_HDR}
              stroke={PANEL_STROKE}
              strokeWidth={0.65}
            />
            <text
              x={colCX(ci)}
              y={TBL_TOP + TBL_HDR / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={11}
              fontWeight={650}
              fill={col.color}
            >
              {col.field}
            </text>
          </g>
        )
      })}

      {/* ── table rows ── */}
      {ROWS.map((row, ri) => {
        const ry = TBL_TOP + TBL_HDR + ri * ROW_H
        return (
          <g key={ri}>
            {/* alternating row tint */}
            <rect
              x={X0 + 1}
              y={ry}
              width={TOTAL_W - 2}
              height={ROW_H}
              fill={"none"}
              stroke="none"
            />

            {/* row separator */}
            {ri > 0 && (
              <line
                x1={X0}
                y1={ry}
                x2={X0 + TOTAL_W}
                y2={ry}
                stroke={PANEL_STROKE}
                strokeWidth={0.38}
              />
            )}

            {/* row number */}
            <text
              x={X0 - 10}
              y={ry + ROW_H / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={10}
              fontWeight={600}
              fill={C.faintInk}
            >
              {ri}
            </text>

            {/* each cell */}
            {COLS.map((col, ci) => (
              <text
                key={ci}
                x={colCX(ci)}
                y={ry + ROW_H / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={FONT_MONO}
                fontSize={ci === 3 ? 11.5 : 14}
                fontWeight={600}
                fill={col.color}
              >
                {row[col.key]}
              </text>
            ))}
          </g>
        )
      })}

      {/* ── row-read annotation: highlight row 1 ── */}
      {(() => {
        const ry = TBL_TOP + TBL_HDR + 1 * ROW_H
        return (
          <g>
            <rect
              x={X0 + 1}
              y={ry}
              width={TOTAL_W - 2}
              height={ROW_H}
              fill="rgba(250,116,78,0.045)"
              stroke="none"
            />
            <rect
              x={X0 + 1}
              y={ry}
              width={TOTAL_W - 2}
              height={ROW_H}
              fill="none"
              stroke="rgba(250,116,78,0.72)"
              strokeWidth={0.9}
            />
          </g>
        )
      })()}

      {/* ══════════════════════════════════════════════════════════════
          DOWN ARROWS — one per column (table → block)
      ══════════════════════════════════════════════════════════════ */}
      {COLS.map((col, ci) => (
        <g key={ci}>
          <line
            x1={colCX(ci)}
            y1={TBL_BOT + 4}
            x2={colCX(ci)}
            y2={ARR_BOT - 6}
            stroke={col.stroke}
            strokeWidth={1.45}
            opacity={0.88}
            markerEnd={`url(#${col.marker})`}
          />
        </g>
      ))}

      {/* ══════════════════════════════════════════════════════════════
          COLUMN BLOCKS — directly below matching table columns
      ══════════════════════════════════════════════════════════════ */}
      <text
        x={X0 + TOTAL_W / 2}
        y={BLK_TOP - 20}
        textAnchor="middle"
        fontSize={12.5}
        fontWeight={760}
        fill={C.ink}
        letterSpacing={1}
      >
        PHYSICAL PAGE
      </text>

      {COLS.map((col, ci) => {
        const cx = colX(ci)
        return (
          <g key={ci}>
            {/* header fill */}
            <rect
              x={cx}
              y={BLK_TOP}
              width={COL_WIDTHS[ci]}
              height={BLK_HDR}
              fill={col.fill}
              stroke="none"
            />

            {/* compact block outline */}
            <rect
              x={cx}
              y={BLK_TOP}
              width={COL_WIDTHS[ci]}
              height={30}
              fill="none"
              stroke={col.stroke}
              strokeWidth={1.25}
            />

            {/* arbitrary offset indicator — row 1 maps to this byte range in the block */}
            <rect
              x={cx + col.offsetHit}
              y={BLK_TOP}
              width={col.hitW}
              height={30}
              fill="rgba(250,116,78,0.11)"
              stroke="rgba(250,116,78,0.68)"
              strokeWidth={0.75}
            />

            {/* block type label above the block */}
            {col.secondaryBlockType ? (
              <>
                <text
                  x={cx + COL_WIDTHS[ci] / 2}
                  y={BLK_TOP + 10}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily={FONT_MONO}
                  fontSize={9}
                  fontWeight={700}
                  fill={col.color}
                >
                  {col.blockType}
                </text>
                <text
                  x={cx + COL_WIDTHS[ci] / 2}
                  y={BLK_TOP + 22}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily={FONT_MONO}
                  fontSize={9}
                  fontWeight={700}
                  fill={col.color}
                >
                  {col.secondaryBlockType}
                </text>
              </>
            ) : (
              <text
                x={cx + COL_WIDTHS[ci] / 2}
                y={BLK_TOP + 16}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={FONT_MONO}
                fontSize={10}
                fontWeight={700}
                fill={col.color}
              >
                {col.blockType}
              </text>
            )}
          </g>
        )
      })}

      {/* ══════════════════════════════════════════════════════════════
          ENCODING REFERENCE — cols 0-2 converge to LZ4/ZSTD chip;
          col 3 unfolds into ordinal-array → dictionary illustration.
      ══════════════════════════════════════════════════════════════ */}
      {(() => {
        const VBOT = BLK_TOP + 30
        const SPLIT_X = Math.round((colX(2) + COL_WIDTHS[2] + colX(3)) / 2)

        // shared vertical rhythm — both sections start their content at the same Y
        const NUM_PANEL_Y = VBOT + 49
        const BKT_Y = Math.round((VBOT + NUM_PANEL_Y) / 2)
        const HEAD_Y = NUM_PANEL_Y + 23
        const CONTENT_Y = HEAD_Y + 24

        // ── cols 0-2: delta encoding ────────────────────────────────────
        const c0 = colCX(0),
          c2 = colCX(2)
        const midX = Math.round((c0 + c2) / 2)

        const D_RAW = ["1700000000", "1700000015", "1700000030"]
        const D_DELTA = ["1700000000", "15", "30"]
        const D_RAW_BYTES = ["8b", "8b", "8b"]
        const D_DELTA_BYTES = ["8b", "1b", "1b"]
        const DC_W = 76,
          DC_GAP = 20,
          DC_H = 22
        const DC_START = midX - (3 * DC_W + 2 * DC_GAP) / 2
        const dcx = (i: number) => DC_START + i * (DC_W + DC_GAP)
        const dccx = (i: number) => dcx(i) + DC_W / 2
        const SIDE_LABEL_X = DC_START - 13
        const TRANSFORM_ARROW_X = DC_START - 7
        const RAW_Y = CONTENT_Y
        const MINUS_Y = RAW_Y + DC_H + 11
        const DELTA_Y = MINUS_Y + 14
        const NUM_PANEL_X = X0 - 14
        const NUM_PANEL_W = SPLIT_X - NUM_PANEL_X - 14
        const NUM_PANEL_CX = NUM_PANEL_X + NUM_PANEL_W / 2

        // ── col 3: two-stage string → ordinal transform + dictionary ───
        const ORDINALS: number[] = [0, 1, 2, 2, 3]
        const TERMS: string[] = [
          "nginx-proxy.us-west-1",
          "nginx-proxy.us-east-1",
          "api-gate.us-east-1",
          "api-gate.us-west-1",
        ]
        const SVC_VALS = ROWS.map((r) => r.svc)

        const TABLE_RIGHT = X0 + TOTAL_W // right edge of logical view table
        const O_CELL_H = 20 // cell height for both blocks
        const O_BLOCK_H = ROWS.length * O_CELL_H // 100

        const STR_X = colX(3) + 16 // left edge of string block
        const STR_W = 120 // wide enough for longest string at 8px
        const ORD_X2 = STR_X + STR_W + 36 // left edge of ordinal block (gap = 36 for arrow)
        const ORD_W = 26
        const DICT_X2 = TABLE_RIGHT - 144 // dict right = table right
        const DICT_W2 = TABLE_RIGHT - DICT_X2 // 144
        const DICT_EH = O_CELL_H
        const DICT_H2 = TERMS.length * DICT_EH

        const O_TOP = CONTENT_Y
        const O_CY = O_TOP + O_BLOCK_H / 2 // vertical centre for arrow and dict alignment
        const DICT_TOP_Y = Math.round(O_CY - DICT_H2 / 2)
        const ORD_PANEL_X = SPLIT_X + 14
        const ORD_PANEL_Y = NUM_PANEL_Y
        const ORD_PANEL_W = X0 + TOTAL_W - ORD_PANEL_X + 14
        const ORD_PANEL_CX = ORD_PANEL_X + ORD_PANEL_W / 2
        const PANEL_H = O_TOP + O_BLOCK_H + 20 - NUM_PANEL_Y

        return (
          <g>
            <rect
              x={NUM_PANEL_X}
              y={NUM_PANEL_Y}
              width={NUM_PANEL_W}
              height={PANEL_H}
              fill={CONTEXT_FILL}
              stroke={CONTEXT_STROKE}
              strokeWidth={0.8}
            />
            <rect
              x={ORD_PANEL_X}
              y={ORD_PANEL_Y}
              width={ORD_PANEL_W}
              height={PANEL_H}
              fill={CONTEXT_FILL}
              stroke={CONTEXT_STROKE}
              strokeWidth={0.8}
            />

            {/* vertical separator between the two sections */}
            <line
              x1={SPLIT_X}
              y1={NUM_PANEL_Y}
              x2={SPLIT_X}
              y2={NUM_PANEL_Y + PANEL_H}
              stroke={CONTEXT_STROKE}
              strokeWidth={0.8}
            />

            {/* section headers */}
            <text
              x={NUM_PANEL_CX}
              y={HEAD_Y - 9}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={7.2}
              fontWeight={650}
              letterSpacing={1}
              fill={CAPTION}
            >
              INSIDE NUMERIC BLOCKS
            </text>
            <text
              x={NUM_PANEL_CX}
              y={HEAD_Y + 3}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={8.8}
              fontWeight={700}
              letterSpacing={0.9}
              fill={C.darkTeal}
            >
              NUMERIC DELTA COMPRESSION
            </text>
            <text
              x={ORD_PANEL_CX}
              y={HEAD_Y - 9}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={7.2}
              fontWeight={650}
              letterSpacing={1}
              fill={CAPTION}
            >
              INSIDE BYTE-REF BLOCK
            </text>
            <text
              x={ORD_PANEL_CX}
              y={HEAD_Y + 3}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={8.8}
              fontWeight={700}
              letterSpacing={0.9}
              fill={C.mutedInk}
            >
              ORDINAL DICTIONARY COMPRESSION
            </text>

            {/* cols 0-2 converge into the numeric encoding section */}
            {[c0, colCX(1), c2].map((cx, i) => (
              <line
                key={i}
                x1={cx}
                y1={VBOT}
                x2={cx}
                y2={BKT_Y}
                stroke={C.darkGray}
                strokeWidth={0.95}
                opacity={0.55}
              />
            ))}
            <line
              x1={c0}
              y1={BKT_Y}
              x2={c2}
              y2={BKT_Y}
              stroke={C.darkGray}
              strokeWidth={0.95}
              opacity={0.55}
            />
            <line
              x1={midX}
              y1={BKT_Y}
              x2={midX}
              y2={NUM_PANEL_Y}
              stroke={C.teal}
              strokeWidth={1.25}
              markerEnd="url(#mk-teal)"
              opacity={0.86}
            />

            {/* service block feeds the ordinal dictionary section */}
            <line
              x1={colCX(3)}
              y1={VBOT}
              x2={colCX(3)}
              y2={ORD_PANEL_Y}
              stroke={C.darkGray}
              strokeWidth={1.2}
              markerEnd="url(#mk-gray)"
              opacity={0.72}
            />
            {/* delta encoding illustration */}
            {/* "RAW" side label */}
            <text
              x={SIDE_LABEL_X}
              y={RAW_Y + DC_H / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={7}
              fontWeight={600}
              letterSpacing={0.8}
              fill={C.darkGray}
            >
              RAW
            </text>
            {/* raw value cells */}
            {D_RAW.map((v, i) => (
              <g key={i}>
                <rect
                  x={dcx(i)}
                  y={RAW_Y}
                  width={DC_W}
                  height={DC_H}
                  fill="rgba(255,255,255,0.88)"
                  stroke={PANEL_STROKE}
                  strokeWidth={0.65}
                />
                <text
                  x={dccx(i)}
                  y={RAW_Y + DC_H / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily={FONT_MONO}
                  fontSize={9}
                  fontWeight={550}
                  fill={C.ink}
                >
                  {v}
                </text>
              </g>
            ))}
            {/* byte labels below raw cells */}
            {D_RAW_BYTES.map((b, i) => (
              <text
                key={i}
                x={dccx(i)}
                y={RAW_Y + DC_H + 6}
                textAnchor="middle"
                dominantBaseline="hanging"
                fontFamily={FONT_MONO}
                fontSize={8}
                fill={C.darkGray}
                opacity={0.58}
              >
                {b}
              </text>
            ))}
            {/* minus circles between adjacent raw cells */}
            {[0, 1].map((i) => {
              const mx = dcx(i) + DC_W + DC_GAP / 2
              return (
                <g key={i}>
                  <circle
                    cx={mx}
                    cy={MINUS_Y}
                    r={8}
                    fill="rgba(255,255,255,0.88)"
                    stroke={PANEL_STROKE}
                    strokeWidth={0.65}
                  />
                  <text
                    x={mx}
                    y={MINUS_Y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={10}
                    fill={C.faintInk}
                  >
                    δ
                  </text>
                </g>
              )
            })}
            {/* vertical arrow from raw row to delta row — left of cells to avoid label overlap */}
            <line
              x1={TRANSFORM_ARROW_X}
              y1={RAW_Y + DC_H / 2}
              x2={TRANSFORM_ARROW_X}
              y2={DELTA_Y + DC_H / 2 - 4}
              stroke={C.darkGray}
              strokeWidth={1.05}
              markerEnd="url(#mk-gray)"
              opacity={0.7}
            />
            {/* "DELTA" side label */}
            <text
              x={SIDE_LABEL_X}
              y={DELTA_Y + DC_H / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={7}
              fontWeight={600}
              letterSpacing={0.8}
              fill={C.darkTeal}
            >
              DELTA
            </text>
            {/* delta value cells */}
            {D_DELTA.map((v, i) => (
              <g key={i}>
                <rect
                  x={dcx(i)}
                  y={DELTA_Y}
                  width={DC_W}
                  height={DC_H}
                  fill={TINT.semantic}
                  stroke={C.teal}
                  strokeWidth={0.7}
                />
                <text
                  x={dccx(i)}
                  y={DELTA_Y + DC_H / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily={FONT_MONO}
                  fontSize={9}
                  fontWeight={650}
                  fill={C.darkTeal}
                >
                  {v}
                </text>
              </g>
            ))}
            {/* byte labels below delta cells */}
            {D_DELTA_BYTES.map((b, i) => (
              <text
                key={i}
                x={dccx(i)}
                y={DELTA_Y + DC_H + 6}
                textAnchor="middle"
                dominantBaseline="hanging"
                fontFamily={FONT_MONO}
                fontSize={8}
                fontWeight={i === 0 ? 400 : 700}
                fill={i === 0 ? C.darkGray : C.darkTeal}
                opacity={i === 0 ? 0.58 : 0.9}
              >
                {b}
              </text>
            ))}

            {/* drop line from col 3 block down to ordinal section */}

            <line
              x1={ORD_X2 + ORD_W / 2}
              y1={VBOT}
              x2={ORD_X2 + ORD_W / 2}
              y2={O_TOP - 2}
              strokeWidth={0.75}
              strokeDasharray="2 3"
              opacity={0.28}
            />

            {/* ── STRING block (gray, RAW equivalent) ── */}
            <text
              x={STR_X + STR_W / 2}
              y={O_TOP - 8}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={7}
              fontWeight={600}
              letterSpacing={0.8}
              fill={C.darkGray}
            ></text>
            <rect
              x={STR_X}
              y={O_TOP}
              width={STR_W}
              height={O_BLOCK_H}
              strokeWidth={0.75}
              strokeDasharray="2 3"
              opacity={0.02}
            />
            {SVC_VALS.map((svc, ri) => {
              const cy = O_TOP + ri * O_CELL_H
              return (
                <g key={ri}>
                  {ri > 0 && (
                    <line
                      x1={STR_X}
                      y1={cy}
                      x2={STR_X + STR_W}
                      y2={cy}
                      stroke={C.mediumGray}
                      strokeWidth={0.35}
                      opacity={0.38}
                    />
                  )}
                  <text
                    x={STR_X + 6}
                    y={cy + O_CELL_H / 2}
                    dominantBaseline="central"
                    fontFamily={FONT_MONO}
                    fontSize={7.5}
                    fill={C.mutedInk}
                  >
                    {svc}
                  </text>
                  {/* byte size right-aligned inside cell */}
                  <text
                    x={STR_X + STR_W - 4}
                    y={cy + O_CELL_H / 2}
                    textAnchor="end"
                    dominantBaseline="central"
                    fontFamily={FONT_MONO}
                    fontSize={7}
                    fontWeight={600}
                    fill={C.darkGray}
                    opacity={0.42}
                  >
                    {svc.length}b
                  </text>
                </g>
              )
            })}

            {/* ── horizontal arrow string → ordinal ── */}
            <line
              x1={STR_X + STR_W + 4}
              y1={O_CY}
              x2={ORD_X2 - 5}
              y2={O_CY}
              stroke={C.darkGray}
              strokeWidth={1.05}
              markerEnd="url(#mk-gray)"
              opacity={0.72}
            />

            {/* ── ORDINAL block (teal, DELTA equivalent) ── */}
            <text
              x={ORD_X2 + ORD_W / 2}
              y={O_TOP - 8}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={7}
              fontWeight={600}
              letterSpacing={0.8}
              fill={C.darkTeal}
            ></text>
            <rect
              x={ORD_X2}
              y={O_TOP}
              width={ORD_W}
              height={O_BLOCK_H}
              fill={TINT.semantic}
              stroke={C.teal}
              strokeWidth={0.9}
            />
            {ORDINALS.map((ord, ri) => {
              const cy = O_TOP + ri * O_CELL_H
              return (
                <g key={ri}>
                  {ri > 0 && (
                    <line
                      x1={ORD_X2}
                      y1={cy}
                      x2={ORD_X2 + ORD_W}
                      y2={cy}
                      stroke={C.teal}
                      strokeWidth={0.35}
                      opacity={0.28}
                    />
                  )}
                  <text
                    x={ORD_X2 + ORD_W / 2}
                    y={cy + O_CELL_H / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily={FONT_MONO}
                    fontSize={11}
                    fontWeight={650}
                    fill={C.darkTeal}
                  >
                    {ord}
                  </text>
                </g>
              )
            })}
            {/* 1b labels to the right of ordinal cells */}
            {ORDINALS.map((_, ri) => (
              <text
                key={ri}
                x={ORD_X2 + ORD_W + 3}
                y={O_TOP + ri * O_CELL_H + O_CELL_H / 2}
                dominantBaseline="central"
                fontFamily={FONT_MONO}
                fontSize={7}
                fontWeight={600}
                fill={C.darkTeal}
                opacity={0.72}
              >
                1b
              </text>
            ))}

            {/* ── DICTIONARY ── */}
            {/* <text x={DICT_X2 + DICT_W2 / 2} y={DICT_TOP_Y - 8} textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={7} fontWeight={600} letterSpacing={0.8} fill={C.darkGray}>
              DICTIONARY
            </text>
            <rect x={DICT_X2} y={DICT_TOP_Y} width={DICT_W2} height={DICT_H2} fill="white" stroke={C.mediumGray} strokeWidth={1} />
            {TERMS.map((term, ti) => {
              const ty = DICT_TOP_Y + ti * DICT_EH
              return (
                <g key={ti}>
                  {ti > 0 && (
                    <line x1={DICT_X2} y1={ty} x2={DICT_X2 + DICT_W2} y2={ty}
                      stroke={C.mediumGray} strokeWidth={0.4} opacity={0.5} />
                  )}
                  <rect x={DICT_X2} y={ty} width={20} height={DICT_EH} fill={C.lightGray} stroke="none" />
                  <line x1={DICT_X2 + 20} y1={ty} x2={DICT_X2 + 20} y2={ty + DICT_EH}
                    stroke={C.mediumGray} strokeWidth={0.5} />
                  <text x={DICT_X2 + 10} y={ty + DICT_EH / 2}
                    textAnchor="middle" dominantBaseline="central"
                    fontFamily={FONT_MONO} fontSize={9} fontWeight={700} fill={C.darkGray}>
                    {ti}
                  </text>
                  <text x={DICT_X2 + 26} y={ty + DICT_EH / 2}
                    dominantBaseline="central"
                    fontFamily={FONT_MONO} fontSize={7.5} fill={C.ink}>
                    {term}
                  </text>
                  <text x={DICT_X2 + DICT_W2 - 4} y={ty + DICT_EH / 2}
                    textAnchor="end" dominantBaseline="central"
                    fontFamily={FONT_MONO} fontSize={7} fontWeight={600} fill={C.darkGray} opacity={0.55}>
                    {term.length}b
                  </text>
                </g>
              )
            })} */}
          </g>
        )
      })()}
    </Figure>
  )
}
