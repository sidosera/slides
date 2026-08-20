import { Figure } from "../../share"
import { Node, Arrow, Chip, Edge, Annotation, GroupLabel } from "../../share"
import { C } from "../../share"

// FIGURE 06 — Selector locality bug (major). A planner postmortem:
// merging operand filters globally collapses the query to nothing.
export function Figure06Selector() {
  return (
    <Figure
      number="06"
      title="Selector predicates must stay branch-local"
      subtitle={
        'An early optimizer merged both operands’ selectors into one global filter — service="foo" AND service="bar" — which matches nothing. Selectors belong to their operand.'
      }
      width={960}
      height={430}
    >
      {/* divider */}
      <Edge
        x1={480}
        y1={60}
        x2={480}
        y2={380}
        color={C.mediumGray}
        width={1}
        dashed
      />

      {/* LEFT — incorrect */}
      <GroupLabel x={70} y={78} color={C.darkPoppy}>
        INCORRECT LOWERING
      </GroupLabel>
      <Node
        x={120}
        y={104}
        w={240}
        h={46}
        label="global filter"
        variant="error"
      />
      <Chip
        x={240}
        y={186}
        text={'service="foo" AND service="bar"'}
        color={C.darkPoppy}
        size={11}
      />
      <Arrow x1={240} y1={150} x2={240} y2={210} variant="muted" />
      <Node
        x={150}
        y={230}
        w={180}
        h={46}
        label="EmptyRelation"
        variant="error"
      />
      <Annotation x={240} y={314} color={C.darkPoppy}>
        filters can never both hold → no rows
      </Annotation>

      {/* RIGHT — correct */}
      <GroupLabel x={560} y={78} color={C.darkTeal}>
        CORRECT LOWERING
      </GroupLabel>
      <Node x={665} y={104} w={70} h={40} label="/" variant="neutral" mono />
      <Arrow x1={686} y1={144} x2={620} y2={176} variant="logical" />
      <Arrow x1={714} y1={144} x2={780} y2={176} variant="logical" />

      <Node
        x={540}
        y={176}
        w={160}
        h={40}
        label={'service="foo"'}
        variant="semantic"
        mono
      />
      <Node
        x={700}
        y={176}
        w={160}
        h={40}
        label={'service="bar"'}
        variant="semantic"
        mono
      />
      <Arrow x1={620} y1={216} x2={620} y2={248} variant="logical" />
      <Arrow x1={780} y1={216} x2={780} y2={248} variant="logical" />
      <Node
        x={540}
        y={248}
        w={160}
        h={40}
        label="errors branch"
        variant="neutral"
      />
      <Node
        x={700}
        y={248}
        w={160}
        h={40}
        label="requests branch"
        variant="neutral"
      />
      <Annotation x={700} y={330} color={C.mutedInk}>
        selectors remain attached to their operand
      </Annotation>
    </Figure>
  )
}
