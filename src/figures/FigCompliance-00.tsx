import { Figure } from "../diagram/Figure";
import { Node, Arrow, GroupLabel, Label } from "../diagram/grammar";
import { C } from "../diagram/palette";

// FIGURE 08 — How we measured compatibility (light).
// Methodology is the point; the percentage is supporting evidence.
export function Figure08Methodology() {
  const steps = [
    "Public Grafana dashboards",
    "extract PromQL",
    "normalize queries",
    "execute in Elasticsearch",
    "execute in Prometheus",
    "compare behaviour",
    "compatibility corpus",
  ];
  const top = 84;
  const h = 34;
  const step = 50;
  const nx = 56;
  const nw = 250;

  const Bar = ({ y, label, pct, color }: { y: number; label: string; pct: number; color: string }) => {
    const w = 320;
    return (
      <g>
        <Label x={600} y={y - 16} anchor="start" color={C.ink} size={12.5} weight={600}>
          {label}
        </Label>
        <Label x={920} y={y - 16} anchor="end" color={color} size={12.5} weight={600} mono>
          ~{pct}%
        </Label>
        <rect x={600} y={y} width={w} height={22} rx={5} fill={C.lightGray} stroke={C.mediumGray} />
        <rect x={600} y={y} width={(w * pct) / 100} height={22} rx={5} fill={color} />
      </g>
    );
  };

  return (
    <Figure
      number="08"
      title="Testing the queries people actually write"
      subtitle="Real-world PromQL was extracted from public Grafana dashboards, normalized, and run against both engines. Coverage rose from tech preview to GA on that corpus."
      width={960}
      height={top + steps.length * step + 10}
    >
      <GroupLabel x={nx} y={top - 18}>METHODOLOGY</GroupLabel>
      {steps.map((s, i) => {
        const y = top + i * step;
        const v = i === steps.length - 1 ? "physical" : i === 0 ? "semantic" : "neutral";
        return (
          <g key={s}>
            <Node x={nx} y={y} w={nw} h={h} label={s} variant={v} />
            {i < steps.length - 1 && (
              <Arrow x1={nx + nw / 2} y1={y + h} x2={nx + nw / 2} y2={y + step} variant="logical" />
            )}
          </g>
        );
      })}

      <GroupLabel x={600} y={top + 4}>REAL-WORLD QUERY COVERAGE</GroupLabel>
      <Bar y={top + 60} label="Tech Preview" pct={60} color={C.teal} />
      <Bar y={top + 140} label="GA" pct={80} color={C.elasticBlue} />
      <Label x={600} y={top + 210} anchor="start" color={C.darkGray} size={11}>
        share of normalized real-world query shapes
      </Label>
    </Figure>
  );
}
