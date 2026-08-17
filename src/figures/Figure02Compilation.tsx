import { Figure } from "../diagram/Figure";
import { Node, Arrow, Boundary } from "../diagram/grammar";
import { C } from "../diagram/palette";

// FIGURE 02 — PromQL compilation path (medium). Compiler-style vertical plan
// that crosses from PromQL semantics into the shared Elasticsearch engine.
const NW = 300;
const NX = 330;

export function Figure02Compilation() {
  const stages: Array<{ label: string; variant?: "semantic" | "physical" | "neutral" }> = [
    { label: "Prometheus HTTP API", variant: "semantic" },
    { label: "PromQL", variant: "semantic" },
    { label: "Parser / AST", variant: "semantic" },
    { label: "PromQL logical plan", variant: "semantic" },
    { label: "Lowering + optimization", variant: "neutral" },
    { label: "Elasticsearch physical plan", variant: "physical" },
    { label: "Distributed compute", variant: "physical" },
    { label: "Prometheus response", variant: "physical" },
  ];
  const top = 62;
  const h = 44;
  const gap = 30;
  const step = h + gap;

  return (
    <Figure
      number="02"
      title="How a PromQL request becomes an Elasticsearch plan"
      subtitle="PromQL keeps Prometheus semantics through logical planning, then lowers progressively into the shared physical execution machinery."
      width={960}
      height={top + stages.length * step + 6}
    >
      <Boundary x={NX - 40} y={top - 26} w={NW + 80} h={4 * step - gap + 40} label="PromQL semantics" color={C.teal} />
      <Boundary
        x={NX - 40}
        y={top + 4 * step - 12}
        w={NW + 80}
        h={4 * step - gap + 22}
        label="Shared Elasticsearch engine"
        color={C.elasticBlue}
      />

      {stages.map((s, i) => {
        const y = top + i * step;
        return (
          <g key={s.label}>
            <Node x={NX} y={y} w={NW} h={h} label={s.label} variant={s.variant} />
            {i < stages.length - 1 && (
              <Arrow
                x1={NX + NW / 2}
                y1={y + h}
                x2={NX + NW / 2}
                y2={y + step}
                variant={i >= 4 ? "physical" : i === 3 ? "physical" : "logical"}
              />
            )}
          </g>
        );
      })}
    </Figure>
  );
}
