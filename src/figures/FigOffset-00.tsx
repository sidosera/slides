import { Figure } from "../diagram/Figure";
import { Edge, Annotation, GroupLabel, Label, Chip } from "../diagram/grammar";
import { C } from "../diagram/palette";

// FIGURE 10 — offset moves selector evaluation (light).
// Two timelines sharing the same evaluation timestamp T.
export function Figure10Offset() {
  const Tx = 792;
  const axL = 120;
  const axR = 860;

  const Marker = ({ x, y, label, color = C.ink }: { x: number; y: number; label: string; color?: string }) => (
    <g>
      <line x1={x} y1={y - 7} x2={x} y2={y + 7} stroke={color} strokeWidth={1.25} />
      <Label x={x} y={y + 22} color={color} size={11} mono>
        {label}
      </Label>
    </g>
  );

  const Window = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
    <rect x={x1} y={y - 9} width={x2 - x1} height={18} rx={4} fill={C.teal} opacity={0.85} />
  );

  return (
    <Figure
      number="10"
      title="offset shifts selector evaluation, not the result"
      subtitle="rate(http_requests_total[5m] offset 1h) keeps its evaluation at T. Only the selector's source window slides back by one hour."
      width={960}
      height={360}
    >
      <Chip x={120} y={44} text="rate(http_requests_total[5m] offset 1h)" anchor="start" size={11} color={C.darkTeal} />

      {/* shared evaluation guide */}
      <line x1={Tx} y1={96} x2={Tx} y2={300} stroke={C.darkGray} strokeWidth={1} strokeDasharray="3 4" />
      <Label x={Tx} y={92} color={C.darkGray} size={10} weight={600}>
        evaluation @ T
      </Label>

      {/* NORMAL */}
      <GroupLabel x={axL} y={118}>NORMAL SELECTOR</GroupLabel>
      <Edge x1={axL} y1={150} x2={axR} y2={150} color={C.mediumGray} width={1.5} />
      <Window x1={692} x2={Tx} y={150} />
      <Marker x={692} y={150} label="T-5m" />
      <Marker x={Tx} y={150} label="T" color={C.darkTeal} />

      {/* OFFSET */}
      <GroupLabel x={axL} y={238}>OFFSET 1h</GroupLabel>
      <Edge x1={axL} y1={270} x2={axR} y2={270} color={C.mediumGray} width={1.5} />
      <Window x1={300} x2={392} y={270} />
      <Marker x={300} y={270} label="T-1h-5m" />
      <Marker x={392} y={270} label="T-1h" />
      <Marker x={Tx} y={270} label="T" color={C.darkTeal} />
      <Edge x1={392} y1={270} x2={Tx - 4} y2={270} color={C.darkGray} width={1} dashed />

      <Annotation x={480} y={330} color={C.darkGray}>
        the source window moves; the output timestamp stays at T
      </Annotation>
    </Figure>
  );
}
