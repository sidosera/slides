import { Figure } from "../diagram/Figure"
import { Annotation, GroupLabel } from "../diagram/grammar"
import { C, TINT, FONT_MONO } from "../diagram/palette"

// FIGURE 14 — Page: columnar block structure.
// Four vertical blocks (one per column) are the primary visual. Each block shows
// its type badge, field name + dtype header, and compact empty row slots to convey
// "there are N rows here" without listing actual values.

const BLOCKS = [
  { type: "IntBlock",      field: "pod_id",    dtype: "INT32",     note: "run-length encoded",           color: C.darkBlue,  stroke: C.elasticBlue, fill: TINT.physical },
  { type: "LongBlock",     field: "timestamp", dtype: "INT64",     note: "delta from epoch base",        color: C.darkTeal,  stroke: C.teal,        fill: TINT.semantic },
  { type: "DoubleBlock",   field: "value",     dtype: "FLOAT64",   note: "8 B IEEE 754 per value",       color: C.ink,       stroke: C.mediumGray,  fill: C.white       },
  { type: "BytesRefBlock", field: "label",     dtype: "BYTES_REF", note: "dict-encoded · 3 unique keys", color: C.darkGray,  stroke: C.mediumGray,  fill: C.lightGray   },
]

const N       = 6    // positionCount (number of row slots shown)
const RH      = 20   // row height (compact, no values)
const HDR_H   = 28   // dtype header height
const BADGE_H = 18   // type badge height
const BW      = 140  // block width
const BGAP    = 14   // gap between blocks
const BODY_H  = N * RH         // 120
const BLK_H   = HDR_H + BODY_H // 148

const TOTAL_BW = BLOCKS.length * BW + (BLOCKS.length - 1) * BGAP  // 598
const BX0      = Math.round((960 - TOTAL_BW) / 2)                  // 181
const BY       = 74  // block body top (badge sits above this)

export function Figure14PageBlocks() {
  const blockBottom = BY + BLK_H  // 222

  return (
    <Figure
      number="14"
      title="Page: columnar block structure"
      subtitle="A Page holds one typed Block per column — a contiguous array covering positionCount positions. Columnar layout enables per-block compression (run-length, delta-encoding, dictionary) and SIMD-friendly processing; operators never materialise a whole row at once."
      width={960}
      height={blockBottom + 52}
    >
      <GroupLabel x={BX0} y={BY - BADGE_H - 22}>
        PHYSICAL STORAGE — one Block per column (Page)
      </GroupLabel>

      {BLOCKS.map((blk, bi) => {
        const bx = BX0 + bi * (BW + BGAP)
        return (
          <g key={bi}>
            {/* type badge */}
            <rect x={bx} y={BY - BADGE_H - 2} width={BW} height={BADGE_H} rx={4}
              fill={blk.fill} stroke={blk.stroke} strokeWidth={1} />
            <text x={bx + BW / 2} y={BY - BADGE_H / 2 - 2}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={9} fontWeight={700} fill={blk.color}>
              {blk.type}
            </text>

            {/* outer border */}
            <rect x={bx} y={BY} width={BW} height={BLK_H} rx={4}
              fill="none" stroke={blk.stroke} strokeWidth={1.5} />

            {/* dtype header */}
            <rect x={bx} y={BY} width={BW} height={HDR_H} fill={blk.fill} />
            <line x1={bx} y1={BY + HDR_H} x2={bx + BW} y2={BY + HDR_H}
              stroke={blk.stroke} strokeWidth={0.75} />
            <text x={bx + BW / 2} y={BY + HDR_H / 2}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={9} fontWeight={600} fill={blk.color}>
              {blk.field} [{blk.dtype}]
            </text>

            {/* empty row dividers — no values */}
            {Array.from({ length: N - 1 }, (_, ri) => (
              <line key={ri}
                x1={bx} y1={BY + HDR_H + (ri + 1) * RH}
                x2={bx + BW} y2={BY + HDR_H + (ri + 1) * RH}
                stroke={blk.stroke} strokeWidth={0.35} opacity={0.45} />
            ))}

            {/* compression note */}
            <text x={bx + BW / 2} y={blockBottom + 16}
              textAnchor="middle" fontSize={9} fontStyle="italic" fill={C.darkGray}>
              {blk.note}
            </text>
          </g>
        )
      })}

      {/* positionCount brace on left edge */}
      <line x1={BX0 - 14} y1={BY + HDR_H} x2={BX0 - 14} y2={blockBottom}
        stroke={C.mediumGray} strokeWidth={1.25} />
      <line x1={BX0 - 14} y1={BY + HDR_H} x2={BX0 - 8} y2={BY + HDR_H}
        stroke={C.mediumGray} strokeWidth={1.25} />
      <line x1={BX0 - 14} y1={blockBottom} x2={BX0 - 8} y2={blockBottom}
        stroke={C.mediumGray} strokeWidth={1.25} />
      <text x={BX0 - 17} y={BY + HDR_H + BODY_H / 2}
        textAnchor="end" dominantBaseline="central" fontSize={9} fill={C.darkGray}>
        positionCount=6
      </text>

      <Annotation x={960 / 2} y={blockBottom + 38} size={10}>
        one logical row = one cell per block · blocks compressed independently · operators process one block at a time
      </Annotation>
    </Figure>
  )
}
