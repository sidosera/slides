import { Figure } from "../diagram/Figure";
import { Node, Arrow, Chip, ExchangeBoundary, GroupLabel, Label } from "../diagram/grammar";
import { C } from "../diagram/palette";

// FIGURE 11 — Vector matching in a distributed engine (major).
// Two independently sharded branches meet at an exchange keyed by matching labels.
export function Figure11VectorMatch() {
  const shard = (x: number, cy: number) =>
    [0, 1, 2].map((i) => (
      <Node key={i} x={x} y={cy + i * 36} w={104} h={28} label={`shard ${i + 1}`} variant="physical" />
    ));

  const cxc = 480;

  return (
    <Figure
      number="11"
      title="Where does series matching happen in a distributed plan?"
      subtitle="Both operands are evaluated across different shards. Matching is a distributed shuffle keyed by the match labels, followed by cardinality enforcement — the largest remaining PromQL gap."
      width={980}
      height={580}
    >
      {/* LEFT branch */}
      <GroupLabel x={70} y={60} color={C.darkBlue}>LEFT OPERAND</GroupLabel>
      {shard(70, 74)}
      <Node x={54} y={196} w={150} h={40} label="partial left series" variant="neutral" />
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={174} y1={88 + i * 36} x2={129} y2={200} variant="physical" />
      ))}

      {/* RIGHT branch */}
      <GroupLabel x={806} y={60} anchor="end" color={C.darkBlue}>RIGHT OPERAND</GroupLabel>
      {shard(806, 74)}
      <Node x={776} y={196} w={150} h={40} label="partial right series" variant="neutral" />
      {[0, 1, 2].map((i) => (
        <Arrow key={i} x1={806} y1={88 + i * 36} x2={851} y2={200} variant="physical" />
      ))}

      {/* Exchange */}
      <Arrow x1={129} y1={236} x2={410} y2={300} variant="network" />
      <Arrow x1={851} y1={236} x2={550} y2={300} variant="network" />
      <ExchangeBoundary x1={120} x2={860} y={272} label="EXCHANGE / SHUFFLE" />
      <Chip x={120} y={300} text="key = (cluster, namespace)" anchor="start" size={11} color={C.darkBlue} />

      {/* central match pipeline */}
      <Node x={cxc - 105} y={318} w={210} h={48} label="distributed series match" variant="physical" />
      <Arrow x1={cxc} y1={366} x2={cxc} y2={396} variant="physical" />
      <Node x={cxc - 105} y={396} w={210} h={42} label="cardinality validation" variant="neutral" />
      <Arrow x1={cxc} y1={438} x2={cxc} y2={466} variant="logical" />
      <Node x={cxc - 95} y={466} w={190} h={40} label="reconstruct output labels" variant="neutral" />
      <Arrow x1={cxc} y1={506} x2={cxc} y2={532} variant="logical" />
      <Node x={cxc - 75} y={532} w={150} h={38} label="arithmetic" variant="neutral" />

      {/* modifiers */}
      <GroupLabel x={708} y={392} color={C.darkTeal}>MATCH MODIFIERS</GroupLabel>
      {["on(...)", "ignoring(...)", "group_left(...)", "group_right(...)"].map((c, i) => (
        <Chip key={c} x={708} y={418 + i * 32} text={c} anchor="start" size={11} color={C.darkTeal} />
      ))}
      <Label x={708} y={556} anchor="start" color={C.darkGray} size={11}>
        enforce one-to-one / many-to-one
      </Label>
    </Figure>
  );
}
