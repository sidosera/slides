import { Figure } from "../diagram/Figure";
import { Node, Arrow, Edge, Annotation, Label } from "../diagram/grammar";
import { C } from "../diagram/palette";

// FIGURE 13 — The shared engine (light, concluding). The technically informed
// echo of Figure 01: PromQL owns semantics, Elasticsearch owns execution.
export function Figure13SharedEngine() {
  const cx = 430;
  const chain: Array<{ label: string; variant: "neutral" | "physical"; w: number }> = [
    { label: "logical plans", variant: "neutral", w: 200 },
    { label: "optimizer", variant: "neutral", w: 170 },
    { label: "distributed compute", variant: "physical", w: 220 },
    { label: "columnar / vectorized operators", variant: "physical", w: 264 },
    { label: "Elasticsearch storage", variant: "physical", w: 200 },
  ];
  const top = 148;
  const h = 44;
  const step = 66;

  const capabilities = ["exchanges", "aggregation", "memory accounting", "circuit breakers", "vectorized execution"];

  return (
    <Figure
      number="13"
      title="One shared engine, two language frontends"
      subtitle="PromQL and ES|QL both lower into the same optimizer and distributed compute. PromQL owns Prometheus semantics; Elasticsearch owns execution."
      width={960}
      height={510}
    >
      {/* frontends */}
      <Node x={cx - 190} y={56} w={150} h={44} label="ES|QL" variant="neutral" />
      <Node x={cx + 40} y={56} w={150} h={44} label="PromQL" variant="semantic" />
      <Arrow x1={cx - 115} y1={100} x2={cx - 40} y2={top} variant="logical" />
      <Arrow x1={cx + 115} y1={100} x2={cx + 40} y2={top} variant="semantic" />

      {/* shared chain */}
      {chain.map((c, i) => {
        const y = top + i * step;
        return (
          <g key={c.label}>
            <Node x={cx - c.w / 2} y={y} w={c.w} h={h} label={c.label} variant={c.variant} />
            {i < chain.length - 1 && (
              <Arrow x1={cx} y1={y + h} x2={cx} y2={y + step} variant={i >= 1 ? "physical" : "logical"} />
            )}
          </g>
        );
      })}

      {/* peripheral shared capabilities */}
      <Label x={760} y={top + 2 * step - 18} anchor="start" color={C.darkGray} size={10} weight={600}>
        SHARED CAPABILITIES
      </Label>
      {capabilities.map((cap, i) => {
        const y = top + 2 * step + 6 + i * 30;
        return (
          <g key={cap}>
            <Edge x1={cx + 132} y1={top + 2.5 * step} x2={752} y2={y} color={C.mediumGray} width={1} dashed />
            <Label x={760} y={y} anchor="start" color={C.darkBlue} size={11.5} mono>
              {cap}
            </Label>
          </g>
        );
      })}

      <Annotation x={150} y={top + step + 4} anchor="start" color={C.darkTeal}>
        Prometheus
      </Annotation>
      <Annotation x={150} y={top + step + 20} anchor="start" color={C.darkTeal}>
        semantics
      </Annotation>
      <Annotation x={150} y={top + 3 * step + 4} anchor="start" color={C.darkBlue}>
        shared
      </Annotation>
      <Annotation x={150} y={top + 3 * step + 20} anchor="start" color={C.darkBlue}>
        execution
      </Annotation>
    </Figure>
  );
}
