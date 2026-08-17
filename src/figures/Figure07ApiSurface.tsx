import { Figure } from "../diagram/Figure";
import { Chip, Arrow, GroupLabel, Label, Boundary } from "../diagram/grammar";
import { C } from "../diagram/palette";

// FIGURE 07 — Prometheus compatibility is an API surface (medium).
// The boundary itself is the concept: an entire client protocol surface.
export function Figure07ApiSurface() {
  const cx = 480;
  const cy = 262;

  const group = (
    lx: number,
    ly: number,
    name: string,
    chips: string[],
    from: [number, number],
  ) => (
    <g key={name}>
      <GroupLabel x={lx} y={ly - 10} color={C.darkTeal}>
        {name}
      </GroupLabel>
      {chips.map((c, i) => (
        <Chip key={c} x={lx} y={ly + 16 + i * 30} text={c} anchor="start" size={11} color={C.ink} />
      ))}
      <Arrow x1={from[0]} y1={from[1]} x2={cx} y2={cy} variant="semantic" />
    </g>
  );

  return (
    <Figure
      number="07"
      title={'“Prometheus compatible” is a protocol surface, not a parser'}
      subtitle="Grafana and Prometheus tooling depend on discovery, capability, transport and ingest endpoints — not only PromQL evaluation. The compatibility boundary is the whole surface."
      width={960}
      height={520}
    >
      {/* central compatibility boundary */}
      <Boundary x={cx - 130} y={cy - 56} w={260} h={112} label="Elasticsearch" color={C.elasticBlue} />
      <Label x={cx} y={cy - 4} color={C.darkBlue} size={14} weight={600}>
        Prometheus
      </Label>
      <Label x={cx} y={cy + 16} color={C.darkBlue} size={14} weight={600}>
        compatibility layer
      </Label>

      {group(96, 96, "QUERY", ["/api/v1/query", "/api/v1/query_range"], [250, 130])}
      {group(690, 96, "DISCOVERY", ["/api/v1/labels", "/api/v1/series", "/api/v1/metadata"], [700, 150])}
      {group(724, 250, "CAPABILITY", ["/api/v1/status/buildinfo"], [724, 258])}
      {group(672, 404, "TRANSPORT", ["GET", "POST (form-urlencoded)"], [700, 402])}
      {group(96, 404, "INGEST", ["Prometheus Remote Write"], [250, 402])}
    </Figure>
  );
}
