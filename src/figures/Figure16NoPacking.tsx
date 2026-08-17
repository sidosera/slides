import { Figure } from "../diagram/Figure"
import { Arrow, Boundary, Annotation, GroupLabel } from "../diagram/grammar"
import { C, TINT, FONT_MONO } from "../diagram/palette"

// FIGURE 16 — Flat composite key: step embedded alongside label dims.
// Before packing, a single flat BytesRefHash held the full composite key
// (step bytes + all label column bytes) per row.  For K evaluation steps
// and M unique label combos the map grows to K×M entries; step bytes bloat
// every key and push out cache lines even when labels repeat.

// 2 steps × 2 label combos = 4 rows, 4 flat-map entries
const ROWS = [
  { step: "1000 s", pod: "1", svc: "nginx" },
  { step: "1000 s", pod: "2", svc: "envoy" },
  { step: "1060 s", pod: "1", svc: "nginx" },
  { step: "1060 s", pod: "2", svc: "envoy" },
]

// flat hash table: every (step, label_combo) is a unique entry
const FLAT_ENTRIES = [
  { step: "t₀=1000", pod: "01 00 00 00", svc: "nginx", ord: "0" },
  { step: "t₀=1000", pod: "02 00 00 00", svc: "envoy", ord: "1" },
  { step: "t₁=1060", pod: "01 00 00 00", svc: "nginx", ord: "2" },
  { step: "t₁=1060", pod: "02 00 00 00", svc: "envoy", ord: "3" },
]

const HDR_H = 28, CELL_H = 48, N = ROWS.length
const BLOCK_H = HDR_H + N * CELL_H   // 220
const BY = 90

// input block x positions
const SBX = 20,  SBW = 80    // LongBlock [step]
const IBX = 106, IBW = 72    // IntBlock  [pod_id]
const BBX = 184, BBW = 90    // BytesRefBlock [service]

// flat key structure callout (center)
const KEY_X = 300
const KEY_Y = BY - 2

// flat hash table (right)
const HASH_X = 476
const HASH_W  = 470   // to 946

function InputBlock({
  x, y, w, hdrH, cellH, typeName, fieldName, vals,
  color, stroke, fill,
}: {
  x: number; y: number; w: number; hdrH: number; cellH: number
  typeName: string; fieldName: string; vals: string[]
  color: string; stroke: string; fill: string
}) {
  return (
    <g>
      <rect x={x} y={y - 18} width={w} height={15} rx={3}
        fill={fill} stroke={stroke} strokeWidth={1} />
      <text x={x + w / 2} y={y - 11}
        textAnchor="middle" dominantBaseline="central"
        fontFamily={FONT_MONO} fontSize={8} fontWeight={700} fill={color}>
        {typeName}
      </text>
      <rect x={x} y={y} width={w} height={hdrH + vals.length * cellH}
        rx={4} fill="none" stroke={stroke} strokeWidth={1.5} />
      <rect x={x} y={y} width={w} height={hdrH} fill={fill} />
      <line x1={x} y1={y + hdrH} x2={x + w} y2={y + hdrH}
        stroke={stroke} strokeWidth={0.75} />
      <text x={x + w / 2} y={y + hdrH / 2}
        textAnchor="middle" dominantBaseline="central"
        fontFamily={FONT_MONO} fontSize={8} fontWeight={600} fill={color}>
        {fieldName}
      </text>
      {vals.map((v, ri) => {
        const cy = y + hdrH + ri * cellH
        return (
          <g key={ri}>
            {ri > 0 && (
              <line x1={x} y1={cy} x2={x + w} y2={cy}
                stroke={stroke} strokeWidth={0.35} opacity={0.5} />
            )}
            <text x={x + w / 2} y={cy + cellH / 2}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={11} fontWeight={600} fill={color}>
              {v}
            </text>
          </g>
        )
      })}
    </g>
  )
}

// Single-row byte-segment display for the flat key callout
function FlatKeySegments({ y }: { y: number }) {
  const segs = [
    { label: "step", sub: "8 B", w: 72, color: C.darkTeal,  fill: TINT.semantic, stroke: C.teal },
    { label: "null", sub: "1 B", w: 30, color: C.darkGray,  fill: "rgba(171,180,196,0.22)", stroke: C.mediumGray },
    { label: "pod",  sub: "4 B", w: 52, color: C.darkBlue,  fill: TINT.physical, stroke: C.elasticBlue },
    { label: "len",  sub: "4 B", w: 52, color: C.darkGray,  fill: "rgba(171,180,196,0.22)", stroke: C.mediumGray },
    { label: "data", sub: "var", w: 60, color: C.darkGray,  fill: C.lightGray,   stroke: C.mediumGray },
  ]
  let cx = KEY_X
  return (
    <g>
      {segs.map((seg, i) => {
        const sx = cx
        cx += seg.w + 3
        return (
          <g key={i}>
            <rect x={sx} y={y} width={seg.w} height={32} rx={3}
              fill={seg.fill} stroke={seg.stroke} strokeWidth={1} />
            <text x={sx + seg.w / 2} y={y + 11}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={9} fontWeight={700} fill={seg.color}>
              {seg.label}
            </text>
            <text x={sx + seg.w / 2} y={y + 24}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={8} fill={seg.color}>
              {seg.sub}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export function Figure16NoPacking() {
  const blockCY = BY + BLOCK_H / 2

  return (
    <Figure
      number="16"
      title="Flat composite key: step embedded in every entry"
      subtitle="Before the hierarchical map, a single flat BytesRefHash held the full composite key — step bytes prepended to every label-dimension key. With K evaluation steps and M unique label combinations, the map grows to K×M entries and step bytes bloat every key regardless of label repetition."
      width={960}
      height={530}
    >
      {/* ── LEFT: input page ───────────────────────────────────────── */}
      <GroupLabel x={SBX} y={BY - 30}>INPUT PAGE</GroupLabel>

      <InputBlock x={SBX} y={BY} w={SBW} hdrH={HDR_H} cellH={CELL_H}
        typeName="LongBlock" fieldName="step"
        vals={ROWS.map(r => r.step)}
        color={C.darkTeal} stroke={C.teal} fill={TINT.semantic} />

      <InputBlock x={IBX} y={BY} w={IBW} hdrH={HDR_H} cellH={CELL_H}
        typeName="IntBlock" fieldName="pod_id"
        vals={ROWS.map(r => r.pod)}
        color={C.darkBlue} stroke={C.elasticBlue} fill={TINT.physical} />

      <InputBlock x={BBX} y={BY} w={BBW} hdrH={HDR_H} cellH={CELL_H}
        typeName="BytesRefBlock" fieldName="service"
        vals={ROWS.map(r => r.svc)}
        color={C.darkGray} stroke={C.mediumGray} fill={C.lightGray} />

      {/* ── Arrow: page → hash ─── */}
      <Arrow x1={BBX + BBW + 6} y1={blockCY}
             x2={HASH_X - 8}   y2={blockCY} variant="physical" />

      {/* ── FLAT KEY STRUCTURE callout ─────────────────────────────── */}
      <GroupLabel x={KEY_X} y={BY - 30}>FLAT KEY STRUCTURE</GroupLabel>
      <FlatKeySegments y={KEY_Y} />
      <text x={KEY_X + 140} y={KEY_Y + 48}
        textAnchor="middle" fontSize={9} fontStyle="italic" fill={C.darkTeal}>
        step bytes lead every key
      </text>

      {/* ── RIGHT: flat BytesRefHash ───────────────────────────────── */}
      <GroupLabel x={HASH_X} y={BY - 30}>FLAT BytesRefHash — single level</GroupLabel>

      <Boundary x={HASH_X} y={BY} w={HASH_W} h={BLOCK_H + 36}
        label="BytesRefHash (step + label dims)" color={C.teal} />

      {/* column headers */}
      <text x={HASH_X + 18} y={BY + 24} dominantBaseline="central"
        fontSize={9.5} fontWeight={600} fill={C.teal}>step (8 B in key)</text>
      <text x={HASH_X + 220} y={BY + 24} dominantBaseline="central"
        fontSize={9.5} fontWeight={600} fill={C.teal}>label bytes</text>
      <text x={HASH_X + HASH_W - 18} y={BY + 24} textAnchor="end"
        dominantBaseline="central" fontSize={9.5} fontWeight={600} fill={C.teal}>ordinal</text>

      {FLAT_ENTRIES.map((e, i) => {
        const ey = BY + 44 + i * 46
        return (
          <g key={i}>
            <rect x={HASH_X + 12} y={ey} width={HASH_W - 24} height={36} rx={4}
              fill={i % 2 === 0 ? TINT.semantic : "rgba(2,188,183,0.03)"}
              stroke={C.teal} strokeWidth={0.75} />

            {/* step bytes (teal, 8B) */}
            <rect x={HASH_X + 16} y={ey + 4} width={104} height={28} rx={3}
              fill={TINT.semantic} stroke={C.teal} strokeWidth={0.75} />
            <text x={HASH_X + 68} y={ey + 18} textAnchor="middle"
              dominantBaseline="central" fontFamily={FONT_MONO}
              fontSize={9} fontWeight={600} fill={C.darkTeal}>
              {e.step}
            </text>

            {/* label bytes */}
            <text x={HASH_X + 132} y={ey + 14} dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={9} fill={C.darkBlue}>{e.pod}</text>
            <text x={HASH_X + 228} y={ey + 14} dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={9} fill={C.darkGray}>{e.svc}</text>
            <text x={HASH_X + 132} y={ey + 27} dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={8} fill={C.mediumGray}>pod_id</text>
            <text x={HASH_X + 228} y={ey + 27} dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={8} fill={C.mediumGray}>service</text>

            {/* ordinal */}
            <text x={HASH_X + HASH_W - 26} y={ey + 18} textAnchor="end"
              dominantBaseline="central" fontFamily={FONT_MONO}
              fontSize={13} fontWeight={700} fill={C.darkTeal}>
              grp {e.ord}
            </text>
          </g>
        )
      })}

      <Annotation x={HASH_X + HASH_W / 2} y={BY + BLOCK_H + 48} size={10} color={C.poppy}>
        4 entries = 2 steps × 2 series &nbsp;·&nbsp; key space = K × M &nbsp;·&nbsp; step bytes in every key
      </Annotation>
    </Figure>
  )
}
