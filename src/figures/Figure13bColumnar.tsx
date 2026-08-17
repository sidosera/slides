import { Figure } from "../diagram/Figure"
import { C, TINT, FONT_MONO } from "../diagram/palette"

// FIGURE 13b — Columnar representation: tabular concept → dense column arrays.
// Layout: row table on top, per-column down-arrows, column blocks directly below.
// Each column lands under its table header so the pivot reads spatially.

const W = 960

const ROWS = [
  { pod: "1", ts: "t₀", val: "0.42", svc: "nginx" },
  { pod: "1", ts: "t₁", val: "1.70", svc: "nginx" },
  { pod: "2", ts: "t₀", val: "0.90", svc: "envoy" },
  { pod: "3", ts: "t₀", val: "0.30", svc: "envoy" },
  { pod: "3", ts: "t₁", val: "2.10", svc: "redis" },
]

const COLS = [
  {
    field: "pod_id",
    key: "pod" as const,
    color: C.darkBlue,
    stroke: C.elasticBlue,
    fill: TINT.physical,
    blockType: "IntBlock",
  },
  {
    field: "timestamp",
    key: "ts" as const,
    color: C.darkTeal,
    stroke: C.teal,
    fill: TINT.semantic,
    blockType: "LongBlock",
  },
  {
    field: "value",
    key: "val" as const,
    color: C.ink,
    stroke: C.mediumGray,
    fill: C.lightGray,
    blockType: "DoubleBlock",
  },
  {
    field: "service",
    key: "svc" as const,
    color: C.darkGray,
    stroke: C.darkGray,
    fill: "rgba(171,180,196,0.22)",
    blockType: "BytesRefBlock",
  },
]

// ── shared column geometry (table and blocks share the same x positions) ──────
const COL_W = 160
const COL_GAP = 14
const TOTAL_W = COLS.length * COL_W + (COLS.length - 1) * COL_GAP // 698
const X0 = Math.round((W - TOTAL_W) / 2) // 131

const colX = (ci: number) => X0 + ci * (COL_W + COL_GAP)
const colCX = (ci: number) => colX(ci) + COL_W / 2

// ── row table ─────────────────────────────────────────────────────────────────
const TBL_TOP = 68
const TBL_HDR = 34
const ROW_H = 36
const TBL_H = TBL_HDR + ROWS.length * ROW_H // 214
const TBL_BOT = TBL_TOP + TBL_H // 282

// ── arrow zone ────────────────────────────────────────────────────────────────
const ARR_TOP = TBL_BOT + 12 // 294
const ARR_BOT = ARR_TOP + 44 // 338

// ── column blocks ─────────────────────────────────────────────────────────────
const BLK_TOP = ARR_BOT // 338
const BLK_HDR = 28
const BLK_CH = 34
const BLK_H = BLK_HDR + ROWS.length * BLK_CH // 198
const BLK_BOT = BLK_TOP + BLK_H // 536

// ── bottom property panels ────────────────────────────────────────────────────
const PROP_TOP = BLK_BOT + 36 // 572
const PROP_H = 72
const PROP_PAD = 20
const PROP_W = (W - 2 * PROP_PAD - 2 * 14) / 3

const TOTAL_H = PROP_TOP + PROP_H + 20

export function Figure13bColumnar() {
  return (
    <Figure
      number="13b"
      title="Columnar representation"
      subtitle="The same five rows shown twice. Row storage puts each row contiguous in memory. Columnar storage puts each field contiguous — the physical layout inside an ESQL Page."
      width={W}
      height={TOTAL_H}
    >
      {/* ══════════════════════════════════════════════════════════════
          LABEL: logical table
      ══════════════════════════════════════════════════════════════ */}
      <text
        x={X0 + TOTAL_W / 2}
        y={TBL_TOP - 14}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={C.darkGray}
        letterSpacing={1}
      >
        LOGICAL VIEW — row-oriented table
      </text>

      {/* ── outer table border ── */}
      <rect
        x={X0}
        y={TBL_TOP}
        width={TOTAL_W}
        height={TBL_H}
        rx={6}
        fill="none"
        stroke={C.mediumGray}
        strokeWidth={1}
      />

      {/* ── column headers ── */}
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
                stroke={C.mediumGray}
                strokeWidth={0.5}
                opacity={0.6}
              />
            )}
            <rect
              x={cx}
              y={TBL_TOP}
              width={COL_W}
              height={TBL_HDR}
              fill={col.fill}
              stroke="none"
              rx={ci === 0 ? 6 : 0}
            />
            {/* square off inner corners */}
            {ci === 0 && (
              <rect
                x={cx + COL_W - 8}
                y={TBL_TOP}
                width={8}
                height={TBL_HDR}
                fill={col.fill}
                stroke="none"
              />
            )}
            {ci === COLS.length - 1 && (
              <rect
                x={cx}
                y={TBL_TOP}
                width={8}
                height={TBL_HDR}
                fill={col.fill}
                stroke="none"
                rx={0}
              />
            )}
            <line
              x1={X0}
              y1={TBL_TOP + TBL_HDR}
              x2={X0 + TOTAL_W}
              y2={TBL_TOP + TBL_HDR}
              stroke={C.mediumGray}
              strokeWidth={0.75}
            />
            <text
              x={colCX(ci)}
              y={TBL_TOP + TBL_HDR / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={11}
              fontWeight={700}
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
              fill={ri % 2 === 1 ? "rgba(220,226,234,0.28)" : "none"}
              stroke="none"
            />

            {/* row separator */}
            {ri > 0 && (
              <line
                x1={X0}
                y1={ry}
                x2={X0 + TOTAL_W}
                y2={ry}
                stroke={C.mediumGray}
                strokeWidth={0.4}
              />
            )}

            {/* row number */}
            <text
              x={X0 - 10}
              y={ry + ROW_H / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={9}
              fill={C.mediumGray}
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
                fontSize={13}
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
              fill="rgba(250,116,78,0.09)"
              stroke="none"
            />
            <rect
              x={X0 + 1}
              y={ry}
              width={TOTAL_W - 2}
              height={ROW_H}
              fill="none"
              stroke={C.poppy}
              strokeWidth={1.5}
              strokeDasharray="5 3"
              rx={2}
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
            strokeWidth={2}
            markerEnd={`url(#mk-${
              ci === 0 ? "blue" : ci === 1 ? "teal" : "gray"
            })`}
          />
        </g>
      ))}



      {/* ══════════════════════════════════════════════════════════════
          COLUMN BLOCKS — directly below matching table columns
      ══════════════════════════════════════════════════════════════ */}
      <text
        x={X0 + TOTAL_W / 2}
        y={BLK_TOP - 10}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={C.darkGray}
        letterSpacing={1}
      >
        PHYSICAL PAGE — one Block per column
      </text>

      {COLS.map((col, ci) => {
        const cx = colX(ci)
        return (
          <g key={ci}>
            {/* block type badge */}
            <rect
              x={cx}
              y={BLK_TOP - 28}
              width={COL_W}
              height={18}
              rx={4}
              fill={col.fill}
              stroke={col.stroke}
              strokeWidth={1}
            />
            <text
              x={cx + COL_W / 2}
              y={BLK_TOP - 19}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={9}
              fontWeight={700}
              fill={col.color}
            >
              {col.blockType}
            </text>

            {/* block outer border */}
            <rect
              x={cx}
              y={BLK_TOP}
              width={COL_W}
              height={BLK_H}
              rx={6}
              fill="none"
              stroke={col.stroke}
              strokeWidth={2}
            />

            {/* field header */}
            <rect
              x={cx}
              y={BLK_TOP}
              width={COL_W}
              height={BLK_HDR}
              rx={6}
              fill={col.fill}
              stroke="none"
            />
            <rect
              x={cx}
              y={BLK_TOP + BLK_HDR - 8}
              width={COL_W}
              height={8}
              fill={col.fill}
              stroke="none"
            />
            <line
              x1={cx}
              y1={BLK_TOP + BLK_HDR}
              x2={cx + COL_W}
              y2={BLK_TOP + BLK_HDR}
              stroke={col.stroke}
              strokeWidth={0.75}
            />
            <text
              x={cx + COL_W / 2}
              y={BLK_TOP + BLK_HDR / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={10}
              fontWeight={700}
              fill={col.color}
            >
              {col.field}
            </text>

            {/* value cells */}
            {ROWS.map((row, ri) => {
              const cy = BLK_TOP + BLK_HDR + ri * BLK_CH
              return (
                <g key={ri}>
                  {ri > 0 && (
                    <line
                      x1={cx}
                      y1={cy}
                      x2={cx + COL_W}
                      y2={cy}
                      stroke={col.stroke}
                      strokeWidth={0.35}
                      opacity={0.4}
                    />
                  )}
                  <text
                    x={cx + COL_W / 2}
                    y={cy + BLK_CH / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily={FONT_MONO}
                    fontSize={14}
                    fontWeight={700}
                    fill={col.color}
                  >
                    {row[col.key]}
                  </text>
                </g>
              )
            })}
          </g>
        )
      })}

      {/* ── contiguous scan annotation on the "value" block ── */}
      {(() => {
        const ci = 2
        const cx = colX(ci)
        const x1 = cx - 12
        return (
          <g>
            <line
              x1={x1}
              y1={BLK_TOP + BLK_HDR}
              x2={x1}
              y2={BLK_BOT}
              stroke={C.teal}
              strokeWidth={2}
              markerEnd="url(#mk-teal)"
            />
            <line
              x1={x1}
              y1={BLK_TOP + BLK_HDR}
              x2={x1 + 8}
              y2={BLK_TOP + BLK_HDR}
              stroke={C.teal}
              strokeWidth={1.5}
            />
            <text
              x={x1 - 6}
              y={(BLK_TOP + BLK_HDR + BLK_BOT) / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontSize={9}
              fontStyle="italic"
              fill={C.darkTeal}
              transform={`rotate(-90, ${x1 - 6}, ${(BLK_TOP + BLK_HDR + BLK_BOT) / 2})`}
            >
              one contiguous scan
            </text>
          </g>
        )
      })()}

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM — three property panels
      ══════════════════════════════════════════════════════════════ */}
      {[
        {
          head: "Skip unused columns",
          body: "An operator needing only value never touches pod_id, timestamp, or service — those Blocks are never loaded.",
          color: C.darkBlue,
          stroke: C.elasticBlue,
          fill: TINT.physical,
        },
        {
          head: "Compress per type",
          body: "Each Block picks the encoding that suits its type: delta for LongBlock, run-length or dictionary ordinals for BytesRefBlock.",
          color: C.darkTeal,
          stroke: C.teal,
          fill: TINT.semantic,
        },
        {
          head: "SIMD-width processing",
          body: "All values share one primitive type. Operators iterate a flat array — no per-row type dispatch, cache-line sized batches.",
          color: C.ink,
          stroke: C.mediumGray,
          fill: C.lightGray,
        },
      ].map((item, i) => {
        const px = PROP_PAD + i * (PROP_W + 14)
        return (
          <g key={i}>
            <rect
              x={px}
              y={PROP_TOP}
              width={PROP_W}
              height={PROP_H}
              rx={7}
              fill={item.fill}
              stroke={item.stroke}
              strokeWidth={1.25}
            />
            <text
              x={px + 14}
              y={PROP_TOP + 20}
              dominantBaseline="central"
              fontSize={11}
              fontWeight={700}
              fill={item.color}
            >
              {item.head}
            </text>
            <foreignObject
              x={px + 10}
              y={PROP_TOP + 32}
              width={PROP_W - 20}
              height={PROP_H - 36}
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  fontSize: 10.5,
                  lineHeight: 1.5,
                  color: C.ink,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {item.body}
              </div>
            </foreignObject>
          </g>
        )
      })}
    </Figure>
  )
}
