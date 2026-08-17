import { Figure } from "../diagram/Figure";
import { C, TINT, FONT_MONO } from "../diagram/palette";

// FIGURE 15b — Walk-through of BlockHash's O(1) per-row group-ID assignment.

const W = 960;

// ── Phase timeline ──────────────────────────────────────────────────────────
const PHASES = [
  {
    label: "Row arrives",
    sub: "Input page delivers one column value per row.",
    color: C.darkBlue,
    fill: TINT.physical,
    stroke: C.elasticBlue,
  },
  {
    label: "Hash-table lookup",
    sub: "BlockHash probes its internal LongHash (int64 key). O(1) amortised.",
    color: C.darkTeal,
    fill: TINT.semantic,
    stroke: C.teal,
  },
  {
    label: "Ordinal assigned",
    sub: "First occurrence → insert new entry, emit next dense ordinal.",
    color: C.darkTeal,
    fill: TINT.semantic,
    stroke: C.teal,
  },
  {
    label: "Accumulator update",
    sub: "accumulators[ordinal] += value — direct array index, no map traversal.",
    color: C.darkBlue,
    fill: TINT.physical,
    stroke: C.elasticBlue,
  },
];

const PH_W = 200, PH_H = 90, PH_GAP = 12;
const totalPW = PHASES.length * PH_W + (PHASES.length - 1) * PH_GAP;
const pStartX = (W - totalPW) / 2;
const PH_TOP = 52;

// ── Worked example ──────────────────────────────────────────────────────────
const EX_TOP = PH_TOP + PH_H + 70;
const ROWS = [
  { val: "1", ord: "0 (new)", hit: false },
  { val: "1", ord: "0 (hit)", hit: true },
  { val: "2", ord: "1 (new)", hit: false },
  { val: "2", ord: "1 (hit)", hit: true },
  { val: "3", ord: "2 (new)", hit: false },
  { val: "3", ord: "2 (hit)", hit: true },
];
const CELL_H = 28, CELL_W = 100;
const EX_LEFT = 60;

export function Figure15bBlockHashExplain() {
  return (
    <Figure
      number="15b"
      title="Walk-through: BlockHash O(1) group-ID assignment"
      subtitle="Each incoming row goes through four deterministic micro-steps. Dense ordinals allow direct-indexed accumulator arrays — no sorted-map traversal, no pointer chasing."
      width={W}
      height={480}
    >
      {/* ── Phase boxes ──────────────────────────────────────────────── */}
      {PHASES.map((p, i) => {
        const x = pStartX + i * (PH_W + PH_GAP);
        return (
          <g key={i}>
            <rect x={x} y={PH_TOP} width={PH_W} height={PH_H} rx={9}
              fill={p.fill} stroke={p.stroke} strokeWidth={1.5} />
            <circle cx={x + 20} cy={PH_TOP + 20} r={12}
              fill={p.stroke} />
            <text x={x + 20} y={PH_TOP + 20}
              textAnchor="middle" dominantBaseline="central"
              fontSize={12} fontWeight={700} fill={C.white}>
              {i + 1}
            </text>
            <text x={x + 38} y={PH_TOP + 20}
              dominantBaseline="central"
              fontSize={11.5} fontWeight={700} fill={p.color}>
              {p.label}
            </text>
            <foreignObject x={x + 10} y={PH_TOP + 40} width={PH_W - 20} height={PH_H - 46}>
              <div xmlns="http://www.w3.org/1999/xhtml"
                style={{ fontSize: 10.5, lineHeight: 1.45, color: C.ink, fontFamily: "'Inter', sans-serif" }}>
                {p.sub}
              </div>
            </foreignObject>
            {i < PHASES.length - 1 && (
              <line x1={x + PH_W + 2} y1={PH_TOP + PH_H / 2}
                x2={x + PH_W + PH_GAP - 2} y2={PH_TOP + PH_H / 2}
                stroke={C.elasticBlue} strokeWidth={1.5}
                markerEnd="url(#mk-blue)" />
            )}
          </g>
        );
      })}

      {/* ── Worked example heading ──────────────────────────────────── */}
      <text x={EX_LEFT} y={EX_TOP - 14}
        fontSize={11} fontWeight={700} fill={C.darkGray} letterSpacing={1.2}>
        WORKED EXAMPLE — pod_id column [1, 1, 2, 2, 3, 3]
      </text>

      {/* Column headers */}
      {["Row", "pod_id value", "Hash-table result", "Ordinal emitted", "Accumulator index"].map((h, i) => (
        <text key={i}
          x={EX_LEFT + i * CELL_W + CELL_W / 2} y={EX_TOP + 12}
          textAnchor="middle" dominantBaseline="central"
          fontSize={9.5} fontWeight={700} fill={C.darkGray} fontFamily={FONT_MONO}>
          {h}
        </text>
      ))}
      <line x1={EX_LEFT} y1={EX_TOP + 20} x2={EX_LEFT + 5 * CELL_W} y2={EX_TOP + 20}
        stroke={C.mediumGray} strokeWidth={1} />

      {ROWS.map((r, i) => {
        const ry = EX_TOP + 24 + i * CELL_H;
        const bg = r.hit ? "rgba(2,188,183,0.06)" : TINT.physical;
        const textCol = r.hit ? C.darkTeal : C.darkBlue;
        return (
          <g key={i}>
            <rect x={EX_LEFT} y={ry} width={5 * CELL_W} height={CELL_H - 2} rx={4}
              fill={bg} stroke={r.hit ? C.teal : C.elasticBlue} strokeWidth={0.5} />
            {/* Row # */}
            <text x={EX_LEFT + CELL_W / 2} y={ry + CELL_H / 2 - 1}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={11} fontWeight={600} fill={C.darkGray}>
              {i}
            </text>
            {/* pod_id */}
            <text x={EX_LEFT + CELL_W + CELL_W / 2} y={ry + CELL_H / 2 - 1}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={13} fontWeight={700} fill={textCol}>
              {r.val}
            </text>
            {/* hash result */}
            <text x={EX_LEFT + 2 * CELL_W + CELL_W / 2} y={ry + CELL_H / 2 - 1}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={10} fill={r.hit ? C.darkTeal : C.darkBlue}>
              {r.hit ? "HIT" : "MISS → insert"}
            </text>
            {/* ordinal */}
            <text x={EX_LEFT + 3 * CELL_W + CELL_W / 2} y={ry + CELL_H / 2 - 1}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={11} fontWeight={700} fill={textCol}>
              {r.ord}
            </text>
            {/* accumulator index */}
            <text x={EX_LEFT + 4 * CELL_W + CELL_W / 2} y={ry + CELL_H / 2 - 1}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={FONT_MONO} fontSize={11} fontWeight={600} fill={textCol}>
              [{r.ord.charAt(0)}]
            </text>
          </g>
        );
      })}

      {/* Key point */}
      <rect x={EX_LEFT} y={EX_TOP + 24 + ROWS.length * CELL_H + 16}
        width={5 * CELL_W} height={52} rx={7}
        fill="rgba(11,100,221,0.04)" stroke={C.elasticBlue} strokeWidth={1} strokeDasharray="5 3" />
      <text x={EX_LEFT + 5 * CELL_W / 2}
        y={EX_TOP + 24 + ROWS.length * CELL_H + 34}
        textAnchor="middle" dominantBaseline="central"
        fontSize={11} fontWeight={700} fill={C.darkBlue}>
        Dense ordinals → flat arrays → cache-sequential accumulator updates
      </text>
      <text x={EX_LEFT + 5 * CELL_W / 2}
        y={EX_TOP + 24 + ROWS.length * CELL_H + 52}
        textAnchor="middle" dominantBaseline="central"
        fontSize={11} fill={C.ink}>
        3 distinct values → 3 accumulator slots (sum[], count[], min[]) — O(1) per row, no pointer chasing
      </text>
    </Figure>
  );
}
