import { Figure } from "../diagram/Figure";
import { Node, Arrow, Annotation, GroupLabel, Label } from "../diagram/grammar";
import { C } from "../diagram/palette";

// FIGURE 09 — Classic vs native histogram representation (medium).
// Same PromQL function, two execution shapes: buckets-as-series vs value.
export function Figure09Histograms() {
  const buckets = ['le="0.1"', 'le="0.5"', 'le="1"', 'le="+Inf"'];

  return (
    <Figure
      number="09"
      title="The same function lowers differently for native histograms"
      subtitle="Classic histograms are many bucket series; a native histogram is a single value with bucket structure inside it — so histogram_quantile lowers into a different execution shape."
      width={960}
      height={460}
    >
      {/* CLASSIC */}
      <GroupLabel x={56} y={56}>CLASSIC HISTOGRAM · BUCKETS ARE SERIES</GroupLabel>
      {buckets.map((b, i) => {
        const y = 74 + i * 38;
        return (
          <g key={b}>
            <Node x={56} y={y} w={130} h={30} label={b} variant="semantic" mono />
            <Arrow x1={186} y1={y + 15} x2={300} y2={140} variant="logical" />
          </g>
        );
      })}
      <Node x={300} y={112} w={190} h={56} label="histogram_quantile()" variant="semantic" mono />
      <Arrow x1={490} y1={140} x2={552} y2={140} variant="logical" />
      <Node x={552} y={118} w={120} h={44} label="quantile" variant="neutral" />

      {/* divider */}
      <line x1={56} y1={258} x2={904} y2={258} stroke={C.mediumGray} strokeDasharray="4 4" />

      {/* NATIVE */}
      <GroupLabel x={56} y={300}>NATIVE HISTOGRAM · HISTOGRAM IS A VALUE</GroupLabel>
      <Node x={56} y={318} w={200} h={60} label="exponential_histogram" sub="buckets inside one value" variant="semantic" mono />
      <Arrow x1={256} y1={348} x2={300} y2={348} variant="logical" />
      <Node x={300} y={326} w={190} h={44} label="histogram_quantile" variant="semantic" mono />
      <Arrow x1={490} y1={348} x2={520} y2={348} variant="physical" />
      <Node x={520} y={326} w={190} h={44} label="ES histogram execution" variant="physical" />
      <Arrow x1={710} y1={348} x2={742} y2={348} variant="physical" />
      <Node x={742} y={326} w={120} h={44} label="quantile" variant="neutral" />

      <Annotation x={56} y={418} anchor="start" color={C.darkGray}>
        q=0 → min · q=1 → max · other q → percentile execution
      </Annotation>
      <Label x={672} y={196} anchor="start" color={C.darkGray} size={11}>
        n bucket series → one operator
      </Label>
    </Figure>
  );
}
