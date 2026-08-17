import { Figure } from "../diagram/Figure"
import { Node, Arrow, Annotation, GroupLabel, Label } from "../diagram/grammar"
import { C } from "../diagram/palette"

// FIGURE 04 — One series, many execution rows (major).
// Engine rows -> TimeSeriesCollapse operator -> Prometheus matrix.
const A = C.elasticBlue
const B = C.pink

function Panel({ x, y, w, h }: { x: number y: number w: number h: number }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={9}
      fill={C.white}
      stroke={C.mediumGray}
    />
  )
}

export function Figure04Collapse() {
  const rows = [
    { s: "series_a", t: "10:00", v: "42", c: A },
    { s: "series_a", t: "10:01", v: "43", c: A },
    { s: "series_a", t: "10:02", v: "41", c: A },
    { s: "series_b", t: "10:00", v: "12", c: B },
    { s: "series_b", t: "10:01", v: "14", c: B },
  ]
  const top = 96

  return (
    <Figure
      number="04"
      title="One series, many execution rows"
      subtitle="query_range exposed a missing execution primitive. TimeSeriesCollapse folds flat engine rows back onto the requested per-series evaluation grid."
      width={980}
      height={430}
    >
      {/* LEFT — engine rows */}
      <GroupLabel x={44} y={top - 14}>
        ENGINE COLUMNS
      </GroupLabel>
      <Panel x={44} y={top} w={288} h={230} />
      {rows.map((r, i) => {
        const y = top + 30 + i * (i >= 3 ? 40 : 40) + (i >= 3 ? 16 : 0)
        return (
          <g key={i}>
            <Label x={64} y={y} anchor="start" color={r.c} size={12.5} mono>
              {r.s}
            </Label>
            <Label x={196} y={y} anchor="start" color={C.ink} size={12.5} mono>
              {r.t}
            </Label>
            <Label x={296} y={y} anchor="end" color={C.ink} size={12.5} mono>
              {r.v}
            </Label>
          </g>
        )
      })}

      {/* CENTER — operator */}
      <Node
        x={392}
        y={168}
        w={196}
        h={70}
        label="TimeSeriesCollapse"
        sub="execution operator"
        variant="physical"
      />
      <Arrow x1={332} y1={200} x2={392} y2={200} variant="physical" />
      <Arrow x1={588} y1={200} x2={648} y2={200} variant="physical" />

      {/* RIGHT — Prometheus matrix */}
      <GroupLabel x={648} y={top - 14}>
        PROMETHEUS ROWS
      </GroupLabel>
      <Panel x={648} y={top} w={288} h={230} />
      <Label
        x={668}
        y={top + 34}
        anchor="start"
        color={A}
        size={12.5}
        weight={600}
        mono
      >
        series_a
      </Label>
      <Label x={668} y={top + 58} anchor="start" color={C.ink} size={11.5} mono>
        [('10:00',42),('10:01',43),
      </Label>
      <Label x={668} y={top + 76} anchor="start" color={C.ink} size={11.5} mono>
        ('10:02',41)]
      </Label>
      <Label
        x={668}
        y={top + 122}
        anchor="start"
        color={B}
        size={12.5}
        weight={600}
        mono
      >
        series_b
      </Label>
      <Label
        x={668}
        y={top + 146}
        anchor="start"
        color={C.ink}
        size={11.5}
        mono
      >
        [('10:00',12),('10:01',14)]
      </Label>

      <Annotation x={490} y={362} color={C.darkGray}>
        collapse values onto the requested evaluation-step grid
      </Annotation>
    </Figure>
  )
}
