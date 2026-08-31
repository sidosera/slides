import { Figure } from "../share"
import { Node, Arrow, Chip, Annotation, GroupLabel, Label } from "../share"
import { C } from "../share"

// FIGURE 05 — Binary arithmetic becomes a join (major).
// The emphasis is SERIES MATCH (a distributed hash join), not the "/".
export function Figure05BinaryJoin() {
  const softFill = "rgba(247,249,252,0.62)"
  const softStroke = "#edf1f6"
  const leftCx = 250
  const rightCx = 560
  const nw = 150
  const h = 38
  const rows = [120, 190, 260]
  const nodeX = (cx: number) => cx - nw / 2

  const branch = (cx: number, top: string) => (
    <>
      <Node
        x={nodeX(cx)}
        y={rows[0]}
        w={nw}
        h={h}
        label={top}
        variant="semantic"
        mono
      />
      <Node
        x={nodeX(cx)}
        y={rows[1]}
        w={nw}
        h={h}
        label="rate()"
        variant="semantic"
        mono
      />
      <Node
        x={nodeX(cx)}
        y={rows[2]}
        w={nw}
        h={h}
        label={cx === leftCx ? "series set A" : "series set B"}
        variant="neutral"
      />
      <Arrow x1={cx} y1={rows[0] + h} x2={cx} y2={rows[1]} variant="muted" />
      <Arrow x1={cx} y1={rows[1] + h} x2={cx} y2={rows[2]} variant="muted" />
    </>
  )

  return (
    <Figure
      number="05"
      title="Binary expressions are really joins"
      subtitle="Before / can execute, two independently produced series sets must be matched by label. SERIES MATCH behaves like a distributed hash join, not scalar arithmetic."
      width={960}
      height={560}
    >
      <rect
        x={128}
        y={104}
        width={520}
        height={428}
        fill={softFill}
        stroke={softStroke}
        strokeWidth={0.85}
      />
      <rect
        x={654}
        y={88}
        width={248}
        height={342}
        fill={softFill}
        stroke={softStroke}
        strokeWidth={0.85}
      />
      {/* root "/" */}
      <Node x={360} y={46} w={80} h={38} label="/" variant="neutral" mono />
      <Arrow x1={392} y1={84} x2={leftCx + 30} y2={rows[0]} variant="muted" />
      <Arrow
        x1={408}
        y1={84}
        x2={rightCx - 30}
        y2={rows[0]}
        variant="muted"
      />

      {branch(leftCx, "errors")}
      {branch(rightCx, "requests")}

      {/* converge to SERIES MATCH */}
      <Arrow
        x1={leftCx}
        y1={rows[2] + h}
        x2={370}
        y2={340}
        variant="muted"
      />
      <Arrow
        x1={rightCx}
        y1={rows[2] + h}
        x2={440}
        y2={340}
        variant="muted"
      />
      <Node
        x={300}
        y={340}
        w={210}
        h={56}
        label="SERIES MATCH"
        sub="distributed hash join"
        variant="physical"
      />

      <Arrow x1={405} y1={396} x2={405} y2={430} variant="physical" />
      <Node x={330} y={430} w={150} h={h} label="divide" variant="neutral" />
      <Arrow x1={405} y1={468} x2={405} y2={500} variant="muted" />
      <Node
        x={315}
        y={500}
        w={180}
        h={h}
        label="result series"
        variant="neutral"
      />

      {/* matching example */}
      <GroupLabel x={676} y={106}>
        LABEL MATCHING
      </GroupLabel>
      <Chip
        x={676}
        y={140}
        text={'{cluster="a", instance="1"}'}
        anchor="start"
        size={11}
      />
      <Chip
        x={676}
        y={172}
        text={'{cluster="a", instance="2"}'}
        anchor="start"
        size={11}
      />
      <Chip
        x={676}
        y={204}
        text={'{cluster="b", instance="1"}'}
        anchor="start"
        size={11}
      />
      <Label x={676} y={244} anchor="start" color={C.mutedInk} size={11}>
        matches, many-to-one, against
      </Label>
      <Chip
        x={676}
        y={280}
        text={'{cluster="a"}'}
        anchor="start"
        size={11}
        color={C.darkTeal}
      />
      <Chip
        x={676}
        y={312}
        text={'{cluster="b"}'}
        anchor="start"
        size={11}
        color={C.darkTeal}
      />

      <Chip
        x={676}
        y={372}
        text="on(cluster)"
        anchor="start"
        size={11}
        color={C.darkTeal}
      />
      <Chip
        x={790}
        y={372}
        text="group_left"
        anchor="start"
        size={11}
        color={C.darkTeal}
      />
      <Annotation x={676} y={410} anchor="start" color={C.mutedInk}>
        matching keys and cardinality are semantic
      </Annotation>
    </Figure>
  )
}
