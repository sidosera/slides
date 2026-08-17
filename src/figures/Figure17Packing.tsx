import { Figure } from "../diagram/Figure"
import { Arrow, Boundary, Annotation, GroupLabel } from "../diagram/grammar"
import { C, TINT, FONT_MONO } from "../diagram/palette"

// FIGURE 17 — Hierarchical map: step as outer key, packed labels as inner key.
// With packing, the aggregation state is a two-level structure.  The outer map
// is a LongHash keyed by step (8 B int64).  Each step maps to its own inner
// BytesRefHash keyed only by the packed label dimensions — step bytes never
// enter the inner key.  Inner maps hold M ordinals (one per unique label combo)
// regardless of how many steps have been evaluated.

const ROWS = [
  { step: "1000 s", pod: "1", svc: "nginx" },
  { step: "1000 s", pod: "2", svc: "envoy" },
  { step: "1060 s", pod: "1", svc: "nginx" },
  { step: "1060 s", pod: "2", svc: "envoy" },
]

const HDR_H = 28, CELL_H = 48, N = ROWS.length
const BLOCK_H = HDR_H + N * CELL_H   // 220
const BY = 90

// input block x positions
const SBX = 20,  SBW = 80
const IBX = 106, IBW = 72
const BBX = 184, BBW = 90

// outer LongHash panel
const OM_X = 300
const OM_W = 208
const OM_Y = BY

// inner maps (right panel) — two stacked
const IM_X  = 536
const IM_W  = 408   // to 944
const IM_H  = 120   // height of each inner map
const IM_GAP = 18   // gap between inner maps

// inner map packed key entries (label dims only — no step bytes)
const INNER_ENTRIES = [
  { pod: "01 00 00 00", svc: "nginx", ord: "0" },
  { pod: "02 00 00 00", svc: "envoy", ord: "1" },
]

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

function InnerMap({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <Boundary x={x} y={y} w={IM_W} h={IM_H}
        label={`INNER BytesRefHash — packed labels (${label})`} color={C.teal} />

      {/* key structure reminder header */}
      <text x={x + 18} y={y + 24} dominantBaseline="central"
        fontSize={9} fontWeight={600} fill={C.teal}>
        packed key (no step bytes)
      </text>
      <text x={x + IM_W - 18} y={y + 24} textAnchor="end"
        dominantBaseline="central" fontSize={9} fontWeight={600} fill={C.teal}>
        ordinal
      </text>

      {INNER_ENTRIES.map((e, i) => {
        const ey = y + 38 + i * 36
        return (
          <g key={i}>
            <rect x={x + 12} y={ey} width={IM_W - 24} height={28} rx={4}
              fill={i % 2 === 0 ? TINT.semantic : "rgba(2,188,183,0.03)"}
              stroke={C.teal} strokeWidth={0.75} />

            {/* packed key bytes */}
            <rect x={x + 16} y={ey + 4} width={26} height={20} rx={2}
              fill="rgba(171,180,196,0.22)" stroke={C.mediumGray} strokeWidth={0.75} />
            <text x={x + 29} y={ey + 14} textAnchor="middle"
              dominantBaseline="central" fontFamily={FONT_MONO}
              fontSize={8} fill={C.darkGray}>00</text>

            <rect x={x + 46} y={ey + 4} width={88} height={20} rx={2}
              fill={TINT.physical} stroke={C.elasticBlue} strokeWidth={0.75} />
            <text x={x + 90} y={ey + 14} textAnchor="middle"
              dominantBaseline="central" fontFamily={FONT_MONO}
              fontSize={8} fontWeight={600} fill={C.darkBlue}>{e.pod}</text>

            <rect x={x + 138} y={ey + 4} width={56} height={20} rx={2}
              fill={C.lightGray} stroke={C.mediumGray} strokeWidth={0.75} />
            <text x={x + 166} y={ey + 14} textAnchor="middle"
              dominantBaseline="central" fontFamily={FONT_MONO}
              fontSize={9} fontWeight={600} fill={C.darkGray}>5·{e.svc}</text>

            {/* ordinal */}
            <text x={x + IM_W - 24} y={ey + 14} textAnchor="end"
              dominantBaseline="central" fontFamily={FONT_MONO}
              fontSize={13} fontWeight={700} fill={C.darkTeal}>
              grp {e.ord}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export function Figure17Packing() {
  const blockCY = BY + BLOCK_H / 2

  // y-centers of the two outer map entries (two steps)
  const OM_ENTRY_H = 52
  const OM_ENTRIES_Y = OM_Y + 36   // first entry top y
  const stepYs = [
    OM_ENTRIES_Y + OM_ENTRY_H / 2,
    OM_ENTRIES_Y + OM_ENTRY_H + 8 + OM_ENTRY_H / 2,
  ]

  // y-center of each inner map
  const innerYs = [OM_Y, OM_Y + IM_H + IM_GAP]

  return (
    <Figure
      number="17"
      title="Hierarchical map: step outer, packed labels inner"
      subtitle="With packing, aggregation state becomes two-level. The outer LongHash is keyed by step (8 B int64). Each step maps to its own inner BytesRefHash keyed only by packed label dimensions — step bytes are absent from inner keys. Inner maps hold M ordinals (unique label combos), not K×M."
      width={960}
      height={540}
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

      {/* ── Arrow: page → outer map ─── */}
      <Arrow x1={BBX + BBW + 6} y1={blockCY}
             x2={OM_X - 8}    y2={blockCY} variant="physical" />

      {/* ── CENTER: outer LongHash (step) ──────────────────────────── */}
      <GroupLabel x={OM_X} y={BY - 30}>OUTER MAP</GroupLabel>

      <Boundary x={OM_X} y={OM_Y} w={OM_W}
        h={36 + 2 * OM_ENTRY_H + 8 + 16}
        label="LongHash — step (int64, 8 B)" color={C.teal} />

      {/* outer map entries: step → inner state */}
      {[
        { step: "1000 s", label: "state₀" },
        { step: "1060 s", label: "state₁" },
      ].map((entry, i) => {
        const ey = OM_ENTRIES_Y + i * (OM_ENTRY_H + 8)
        return (
          <g key={i}>
            <rect x={OM_X + 12} y={ey} width={OM_W - 24} height={OM_ENTRY_H} rx={4}
              fill={TINT.semantic} stroke={C.teal} strokeWidth={0.75} />
            {/* step key */}
            <text x={OM_X + 22} y={ey + 17} dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={10} fontWeight={700} fill={C.darkTeal}>
              {entry.step}
            </text>
            <text x={OM_X + 22} y={ey + 34} dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={8.5} fill={C.teal}>
              key = 8 B int64
            </text>
            {/* pointer label */}
            <text x={OM_X + OM_W - 20} y={ey + 26} textAnchor="end"
              dominantBaseline="central" fontFamily={FONT_MONO}
              fontSize={10} fontWeight={600} fill={C.darkTeal}>
              → {entry.label}
            </text>
          </g>
        )
      })}

      {/* ── Arrows: outer entries → inner maps ─── */}
      {[0, 1].map(i => (
        <Arrow key={i}
          x1={OM_X + OM_W + 6} y1={stepYs[i]}
          x2={IM_X - 8}        y2={innerYs[i] + IM_H / 2}
          variant="semantic" />
      ))}

      {/* ── RIGHT: inner maps (one per step) ───────────────────────── */}
      <GroupLabel x={IM_X} y={BY - 30}>INNER MAPS (one per step)</GroupLabel>

      <InnerMap x={IM_X} y={innerYs[0]} label="step t₀ = 1000 s" />
      <InnerMap x={IM_X} y={innerYs[1]} label="step t₁ = 1060 s" />

      {/* key structure contrast annotation */}
      <text x={IM_X + IM_W / 2} y={innerYs[1] + IM_H + 20}
        textAnchor="middle" fontSize={10} fontWeight={600} fill={C.darkTeal}>
        M ordinals per step &nbsp;·&nbsp; step bytes absent from inner key
      </text>

      <Annotation x={IM_X + IM_W / 2} y={innerYs[1] + IM_H + 38} size={10} color={C.darkTeal}>
        2 outer entries + 2 inner entries per step &nbsp;·&nbsp; inner maps independent of step count
      </Annotation>

      {/* legend: null | pod_id | len+data */}
      <text x={IM_X + 29} y={innerYs[1] + IM_H + 58}
        textAnchor="middle" fontSize={8} fill={C.darkGray} fontStyle="italic">null 1B</text>
      <text x={IM_X + 90} y={innerYs[1] + IM_H + 58}
        textAnchor="middle" fontSize={8} fill={C.darkBlue} fontStyle="italic">pod_id 4B</text>
      <text x={IM_X + 166} y={innerYs[1] + IM_H + 58}
        textAnchor="middle" fontSize={8} fill={C.darkGray} fontStyle="italic">len·data</text>
    </Figure>
  )
}
