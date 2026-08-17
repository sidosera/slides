import { Figure } from "../diagram/Figure";
import { C, TINT, FONT_MONO } from "../diagram/palette";

// FIGURE 16b — Walk-through of why flat composite keys cause K×M key-space blow-up.

const W = 960;

const TOP = 52;

// ── Problem anatomy diagram ─────────────────────────────────────────────────
// Shows a 2-D grid: rows = steps, cols = label combos, cells = hash entries

const K = 4; // evaluation steps shown
const M = 3; // distinct label combos shown

const GRID_LEFT = 52;
const GRID_TOP = TOP + 44;
const CELL_W = 118;
const CELL_H = 42;
const HDR_H  = 28;
const HDR_W  = 80;

const STEPS  = ["t₀ = 1000 s", "t₁ = 1060 s", "t₂ = 1120 s", "t₃ = 1180 s"];
const COMBOS = ["pod=1 · svc=nginx", "pod=2 · svc=envoy", "pod=3 · svc=redis"];

// grid ends
const GRID_W = HDR_W + M * CELL_W;
const GRID_H = HDR_H + K * CELL_H;

// ── Callout panel (right) ───────────────────────────────────────────────────
const CALL_X = GRID_LEFT + GRID_W + 40;
const CALL_W = W - CALL_X - 16;

const PROBLEMS = [
  {
    color: C.darkPoppy,
    stroke: C.poppy,
    fill: "rgba(250,116,78,0.06)",
    headline: "K×M entry explosion",
    body: "Every (step, label_combo) pair gets its own hash entry. 4 steps × 3 combos = 12 entries — and K is typically in the hundreds for a 5m range at 1m resolution.",
  },
  {
    color: C.darkTeal,
    stroke: C.teal,
    fill: TINT.semantic,
    headline: "Step bytes in every key",
    body: "The 8-byte step value is prepended to every BytesRefHash key. Identical label bytes are stored K times — one duplicate per step even when nothing changed.",
  },
  {
    color: C.darkBlue,
    stroke: C.elasticBlue,
    fill: TINT.physical,
    headline: "Cache-line pressure",
    body: "Bloated keys push distinct entries further apart in memory. For M label combos evaluated over K steps, the working set grows K× versus the hierarchical approach.",
  },
];

export function Figure16bNoPackingExplain() {
  return (
    <Figure
      number="16b"
      title="Walk-through: flat composite key — K×M blow-up"
      subtitle="A flat BytesRefHash embeds step bytes in every key. The entry count scales with K (steps) × M (label combos), not just M. This diagram dissects why that matters."
      width={W}
      height={440}
    >
      {/* ── Section label ── */}
      <text x={GRID_LEFT} y={TOP}
        fontSize={10} fontWeight={700} fill={C.darkGray} letterSpacing={1.2}>
        FLAT HASH TABLE — entry count = K × M
      </text>

      {/* ── Column combo headers ── */}
      {COMBOS.map((c, ci) => (
        <g key={ci}>
          <rect x={GRID_LEFT + HDR_W + ci * CELL_W} y={GRID_TOP}
            width={CELL_W - 2} height={HDR_H} rx={4}
            fill={TINT.semantic} stroke={C.teal} strokeWidth={1} />
          <text x={GRID_LEFT + HDR_W + ci * CELL_W + CELL_W / 2} y={GRID_TOP + HDR_H / 2}
            textAnchor="middle" dominantBaseline="central"
            fontFamily={FONT_MONO} fontSize={9} fontWeight={600} fill={C.darkTeal}>
            {c}
          </text>
        </g>
      ))}

      {/* ── Row step headers + cells ── */}
      {STEPS.map((s, ki) => {
        const ry = GRID_TOP + HDR_H + ki * CELL_H;
        return (
          <g key={ki}>
            {/* step header */}
            <rect x={GRID_LEFT} y={ry} width={HDR_W - 2} height={CELL_H - 2} rx={4}
              fill={TINT.semantic} stroke={C.teal} strokeWidth={1} />
            <text x={GRID_LEFT + HDR_W / 2} y={ry + CELL_H / 2 - 1}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={9} fontWeight={600} fill={C.darkTeal}>
              {s}
            </text>
            {/* cells: one per label combo */}
            {COMBOS.map((_, ci) => {
              const cx = GRID_LEFT + HDR_W + ci * CELL_W;
              const entryNum = ki * M + ci;
              return (
                <g key={ci}>
                  <rect x={cx} y={ry} width={CELL_W - 2} height={CELL_H - 2} rx={4}
                    fill="rgba(250,116,78,0.07)" stroke={C.poppy} strokeWidth={0.75} />
                  {/* step bytes badge */}
                  <rect x={cx + 6} y={ry + 7} width={40} height={16} rx={3}
                    fill={TINT.semantic} stroke={C.teal} strokeWidth={0.75} />
                  <text x={cx + 26} y={ry + 15}
                    textAnchor="middle" dominantBaseline="central"
                    fontFamily={FONT_MONO} fontSize={8} fontWeight={600} fill={C.darkTeal}>
                    step·8B
                  </text>
                  {/* label bytes badge */}
                  <rect x={cx + 50} y={ry + 7} width={46} height={16} rx={3}
                    fill={TINT.physical} stroke={C.elasticBlue} strokeWidth={0.75} />
                  <text x={cx + 73} y={ry + 15}
                    textAnchor="middle" dominantBaseline="central"
                    fontFamily={FONT_MONO} fontSize={8} fontWeight={600} fill={C.darkBlue}>
                    labels
                  </text>
                  {/* entry number */}
                  <text x={cx + CELL_W - 10} y={ry + CELL_H - 8}
                    textAnchor="end" dominantBaseline="central"
                    fontFamily={FONT_MONO} fontSize={8} fill={C.darkPoppy}>
                    #{entryNum}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* ── Total entry count label ── */}
      <text x={GRID_LEFT + GRID_W / 2} y={GRID_TOP + GRID_H + 20}
        textAnchor="middle" dominantBaseline="central"
        fontSize={11} fontWeight={700} fill={C.darkPoppy}>
        {K} steps × {M} label combos = {K * M} entries (real workloads: hundreds × thousands)
      </text>

      {/* ── Problem callouts ── */}
      <text x={CALL_X} y={TOP}
        fontSize={10} fontWeight={700} fill={C.darkGray} letterSpacing={1.2}>
        WHY THIS HURTS
      </text>
      {PROBLEMS.map((p, i) => {
        const py = TOP + 16 + i * 110;
        return (
          <g key={i}>
            <rect x={CALL_X} y={py} width={CALL_W} height={96} rx={8}
              fill={p.fill} stroke={p.stroke} strokeWidth={1.5} />
            <circle cx={CALL_X + 20} cy={py + 20} r={12} fill={p.stroke} />
            <text x={CALL_X + 20} y={py + 20}
              textAnchor="middle" dominantBaseline="central"
              fontSize={11} fontWeight={700} fill={C.white}>
              {i + 1}
            </text>
            <text x={CALL_X + 40} y={py + 20}
              dominantBaseline="central"
              fontSize={11.5} fontWeight={700} fill={p.color}>
              {p.headline}
            </text>
            <foreignObject x={CALL_X + 12} y={py + 38} width={CALL_W - 24} height={52}>
              <div xmlns="http://www.w3.org/1999/xhtml"
                style={{ fontSize: 10.5, lineHeight: 1.5, color: C.ink, fontFamily: "'Inter', sans-serif" }}>
                {p.body}
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* ── Fix preview ── */}
      <rect x={CALL_X} y={TOP + 16 + PROBLEMS.length * 110 + 6}
        width={CALL_W} height={50} rx={8}
        fill="rgba(11,100,221,0.04)" stroke={C.elasticBlue} strokeWidth={1} strokeDasharray="5 3" />
      <text x={CALL_X + CALL_W / 2}
        y={TOP + 16 + PROBLEMS.length * 110 + 26}
        textAnchor="middle" dominantBaseline="central"
        fontSize={11} fontWeight={700} fill={C.darkBlue}>
        Fix (Figure 17): split into outer LongHash (step) + inner BytesRefHash (labels)
      </text>
      <text x={CALL_X + CALL_W / 2}
        y={TOP + 16 + PROBLEMS.length * 110 + 44}
        textAnchor="middle" dominantBaseline="central"
        fontSize={11} fill={C.darkTeal}>
        Inner maps hold M entries regardless of K — step bytes absent from inner keys.
      </text>
    </Figure>
  );
}
