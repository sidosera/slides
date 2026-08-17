import { Figure } from "../diagram/Figure";
import { C, TINT, FONT_MONO } from "../diagram/palette";

// FIGURE 17b — Walk-through of the two-level hierarchical map and why it fixes K×M.

const W = 960;
const TOP = 52;

// ── Comparison table ────────────────────────────────────────────────────────
const TABLE_LEFT = 36;
const TABLE_TOP  = TOP + 44;
const ROW_H      = 38;
const COL_W      = [160, 196, 196, 196]; // Aspect | Flat (old) | Hierarchical (new) | Saving
const TABLE_W    = COL_W.reduce((a, b) => a + b, 0);

const HEADERS = ["Aspect", "Flat BytesRefHash", "Hierarchical map", "Saving"];
const HEADER_COLORS = [C.darkGray, C.darkPoppy, C.darkTeal, C.darkBlue];
const HEADER_FILLS  = ["rgba(171,180,196,0.15)", "rgba(250,116,78,0.07)", TINT.semantic, TINT.physical];
const HEADER_STROKES = [C.mediumGray, C.poppy, C.teal, C.elasticBlue];

const ROWS = [
  {
    aspect: "Hash entry count",
    flat: "K × M",
    hier: "K outer + M inner/step",
    saving: "From K×M → K+M",
  },
  {
    aspect: "Step bytes in key?",
    flat: "Yes — 8 B in every key",
    hier: "Outer key only",
    saving: "Inner key shrinks",
  },
  {
    aspect: "Memory for labels",
    flat: "Repeated M times per step",
    hier: "Stored once per inner map",
    saving: "K× fewer label copies",
  },
  {
    aspect: "Cache behaviour",
    flat: "Bloated keys spread entries",
    hier: "Compact inner keys, small maps",
    saving: "Better locality",
  },
  {
    aspect: "Coordinator work",
    flat: "Build flat key + aggregate",
    hier: "Merge hierarchical states",
    saving: "No key construction",
  },
];

// ── How it works panel ──────────────────────────────────────────────────────
const HOW_TOP = TABLE_TOP + (ROWS.length + 1) * ROW_H + 32;
const PANEL_W = (W - TABLE_LEFT * 2 - 24) / 3;
const PANELS = [
  {
    color: C.darkTeal,
    fill: TINT.semantic,
    stroke: C.teal,
    title: "Outer LongHash (step)",
    body: "Keyed by the int64 step value (8 bytes). Each entry points to one inner BytesRefHash. There are exactly K outer entries — one per evaluation step in the range.",
  },
  {
    color: C.darkBlue,
    fill: TINT.physical,
    stroke: C.elasticBlue,
    title: "Inner BytesRefHash (labels)",
    body: "Keyed by packed label bytes only — no step prefix. Holds M entries (one per unique label combination). Inner maps are independent: adding a new step never grows existing inner maps.",
  },
  {
    color: C.darkBlue,
    fill: "rgba(11,100,221,0.04)",
    stroke: C.elasticBlue,
    title: "Accumulator arrays",
    body: "Each inner map entry's ordinal indexes directly into per-step accumulator arrays (sum[], count[], min[]). Cache-sequential update — the same O(1) path as a single-level BlockHash.",
  },
];
const PANEL_H = 130;

export function Figure17bPackingExplain() {
  return (
    <Figure
      number="17b"
      title="Walk-through: hierarchical map — outer step, inner labels"
      subtitle="A two-level structure reduces hash entry count from K×M to K+M and removes step bytes from inner keys. This panel compares the two approaches and explains each level's role."
      width={W}
      height={HOW_TOP + PANEL_H + 24}
    >
      {/* ── Comparison table heading ── */}
      <text x={TABLE_LEFT} y={TOP}
        fontSize={10} fontWeight={700} fill={C.darkGray} letterSpacing={1.2}>
        FLAT vs. HIERARCHICAL — side-by-side
      </text>

      {/* Header row */}
      {HEADERS.map((h, ci) => {
        const cx = TABLE_LEFT + COL_W.slice(0, ci).reduce((a, b) => a + b, 0);
        return (
          <g key={ci}>
            <rect x={cx} y={TABLE_TOP} width={COL_W[ci] - 2} height={ROW_H} rx={ci === 0 ? 6 : 4}
              fill={HEADER_FILLS[ci]} stroke={HEADER_STROKES[ci]} strokeWidth={1} />
            <text x={cx + COL_W[ci] / 2} y={TABLE_TOP + ROW_H / 2}
              textAnchor="middle" dominantBaseline="central"
              fontSize={10} fontWeight={700} fill={HEADER_COLORS[ci]} fontFamily={FONT_MONO}>
              {h}
            </text>
          </g>
        );
      })}

      {/* Data rows */}
      {ROWS.map((r, ri) => {
        const ry = TABLE_TOP + (ri + 1) * ROW_H;
        const cells = [r.aspect, r.flat, r.hier, r.saving];
        const cellColors = [C.ink, C.darkPoppy, C.darkTeal, C.darkBlue];
        const cellFills  = [
          ri % 2 === 0 ? C.lightGray : C.white,
          ri % 2 === 0 ? "rgba(250,116,78,0.04)" : C.white,
          ri % 2 === 0 ? "rgba(2,188,183,0.04)" : C.white,
          ri % 2 === 0 ? "rgba(11,100,221,0.04)" : C.white,
        ];
        return cells.map((cell, ci) => {
          const cx = TABLE_LEFT + COL_W.slice(0, ci).reduce((a, b) => a + b, 0);
          return (
            <g key={ci}>
              <rect x={cx} y={ry} width={COL_W[ci] - 2} height={ROW_H - 2} rx={3}
                fill={cellFills[ci]} stroke={ci === 0 ? C.mediumGray : HEADER_STROKES[ci]}
                strokeWidth={0.5} />
              <text x={cx + COL_W[ci] / 2} y={ry + ROW_H / 2 - 1}
                textAnchor="middle" dominantBaseline="central"
                fontFamily={FONT_MONO} fontSize={10} fontWeight={ci === 0 ? 600 : 500}
                fill={cellColors[ci]}>
                {cell}
              </text>
            </g>
          );
        });
      })}

      {/* ── How it works panels ── */}
      <text x={TABLE_LEFT} y={HOW_TOP - 12}
        fontSize={10} fontWeight={700} fill={C.darkGray} letterSpacing={1.2}>
        HOW EACH LEVEL WORKS
      </text>
      {PANELS.map((p, i) => {
        const px = TABLE_LEFT + i * (PANEL_W + 12);
        return (
          <g key={i}>
            <rect x={px} y={HOW_TOP} width={PANEL_W} height={PANEL_H} rx={9}
              fill={p.fill} stroke={p.stroke} strokeWidth={1.5} />
            <circle cx={px + 20} cy={HOW_TOP + 20} r={12} fill={p.stroke} />
            <text x={px + 20} y={HOW_TOP + 20}
              textAnchor="middle" dominantBaseline="central"
              fontSize={12} fontWeight={700} fill={C.white}>
              {i + 1}
            </text>
            <text x={px + 40} y={HOW_TOP + 20}
              dominantBaseline="central"
              fontSize={11.5} fontWeight={700} fill={p.color}>
              {p.title}
            </text>
            <foreignObject x={px + 12} y={HOW_TOP + 38} width={PANEL_W - 24} height={PANEL_H - 46}>
              <div xmlns="http://www.w3.org/1999/xhtml"
                style={{ fontSize: 10.5, lineHeight: 1.5, color: C.ink, fontFamily: "'Inter', sans-serif" }}>
                {p.body}
              </div>
            </foreignObject>
          </g>
        );
      })}
    </Figure>
  );
}
