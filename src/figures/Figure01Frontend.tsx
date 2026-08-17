import { Figure } from "../diagram/Figure";
import { Node, Arrow, Chip, Label } from "../diagram/grammar";
import { C } from "../diagram/palette";

// FIGURE 01 — PromQL becomes another Elasticsearch frontend (light / thesis).
export function Figure01Frontend() {
  return (
    <Figure
      number="01"
      title="PromQL becomes another Elasticsearch frontend"
      subtitle="Two query languages, one execution engine. PromQL is not a separate engine bolted on — it compiles onto the same distributed compute Elasticsearch already runs."
      width={960}
      height={380}
    >
      <Chip x={148} y={40} text="rate(http_requests_total[5m])" color={C.darkTeal} />

      <Node x={60} y={92} w={176} h={52} label="PromQL" sub="Prometheus semantics" variant="semantic" />
      <Node x={60} y={236} w={176} h={52} label="ES|QL" sub="Elasticsearch query language" variant="neutral" />

      <Node
        x={452}
        y={130}
        w={236}
        h={112}
        label="Elasticsearch"
        sub="distributed compute engine"
        variant="physical"
      />
      <Node x={512} y={300} w={176} h={48} label="storage" variant="physical" />

      {/* frontends merge into the shared engine */}
      <Arrow x1={236} y1={118} x2={452} y2={165} variant="semantic" />
      <Arrow x1={236} y1={262} x2={452} y2={210} variant="logical" />
      {/* shared engine down to storage */}
      <Arrow x1={570} y1={242} x2={570} y2={300} variant="physical" />

      <Label x={344} y={128} color={C.darkTeal} size={11} weight={600}>
        Prometheus semantics
      </Label>
      <Label x={344} y={252} color={C.darkGray} size={11} weight={600}>
        ES|QL semantics
      </Label>
    </Figure>
  );
}
