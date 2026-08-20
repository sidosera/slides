import { Figure } from "../../share"
import { Node, Arrow, Edge, Annotation, GroupLabel, Label } from "../../share"
import { C } from "../../share"

// FIGURE 03 — rate() changes the execution model (medium).
// Naive relational path (de-emphasized, insufficient) vs. the real per-series
// time-series execution, with tiny counter series showing a reset.
export function Figure03Rate() {
  const stages = [
    "samples",
    "partition by series",
    "window [5m]",
    "order by timestamp",
    "detect counter reset",
    "rate per series",
    "evaluation timestamp",
    "aggregate by service",
  ]
  const top = 84
  const h = 34
  const gap = 18
  const step = h + gap
  const mx = 300 // main column x
  const mw = 214

  // tiny counter series with a reset (95 -> 103 -> 4 -> 11)
  const series = [
    {
      name: "series a",
      color: C.elasticBlue,
      vals: [95, 103, 4, 11],
      reset: 1,
    },
    { name: "series b", color: C.teal, vals: [12, 14, 15, 17], reset: -1 },
  ]

  return (
    <Figure
      number="03"
      title="rate() is computed per series, before aggregation"
      subtitle="PromQL does not map to scan → group → aggregate. Each series is windowed, ordered, and reset-corrected independently before any cross-series aggregation."
      width={960}
      height={top + stages.length * step + 10}
    >
      {/* Naive, de-emphasized comparison */}
      <GroupLabel x={40} y={top - 22}>
        NAIVE — INSUFFICIENT
      </GroupLabel>
      {["scan", "group", "aggregate"].map((l, i) => {
        const y = top + i * step
        return (
          <g key={l}>
            <Node x={40} y={y} w={140} h={h} label={l} variant="muted" />
            {i < 2 && (
              <Arrow
                x1={110}
                y1={y + h}
                x2={110}
                y2={y + step}
                variant="muted"
              />
            )}
          </g>
        )
      })}
      <Annotation x={110} y={top + 3 * step + 6} color={C.darkPoppy}>
        loses per-series semantics
      </Annotation>

      {/* Main time-series execution */}
      <GroupLabel x={mx} y={top - 22} color={C.ink}>
        TIME-SERIES EXECUTION
      </GroupLabel>
      {stages.map((s, i) => {
        const y = top + i * step
        const highlight = i === 4 ? "error" : i === 5 ? "semantic" : "neutral"
        return (
          <g key={s}>
            <Node x={mx} y={y} w={mw} h={h} label={s} variant={highlight} />
            {i < stages.length - 1 && (
              <Arrow
                x1={mx + mw / 2}
                y1={y + h}
                x2={mx + mw / 2}
                y2={y + step}
                variant="logical"
              />
            )}
          </g>
        )
      })}

      {/* Tiny counter series with reset, aligned to the middle stages */}
      <GroupLabel x={620} y={top - 22} color={C.ink}>
        INPUT COUNTER SERIES
      </GroupLabel>
      {series.map((s, si) => {
        const baseY = top + 40 + si * 96
        const x0 = 640
        const dx = 66
        return (
          <g key={s.name}>
            <Label
              x={x0}
              y={baseY - 22}
              anchor="start"
              color={s.color}
              size={11}
              weight={600}
            >
              {s.name}
            </Label>
            {s.vals.map((v, i) => {
              const x = x0 + i * dx
              const isResetEnd = i === s.reset
              return (
                <g key={i}>
                  {i > 0 && (
                    <Edge
                      x1={x0 + (i - 1) * dx}
                      y1={baseY}
                      x2={x}
                      y2={baseY}
                      color={isResetEnd ? C.poppy : s.color}
                      width={isResetEnd ? 2 : 1.25}
                      dashed={isResetEnd}
                    />
                  )}
                  <circle
                    cx={x}
                    cy={baseY}
                    r={4.5}
                    fill={isResetEnd ? C.poppy : s.color}
                  />
                  <Label
                    x={x}
                    y={baseY - 16}
                    color={isResetEnd ? C.darkPoppy : C.ink}
                    size={11}
                    mono
                  >
                    {String(v)}
                  </Label>
                </g>
              )
            })}
            {s.reset >= 0 && (
              <Annotation
                x={x0 + s.reset * dx - 4}
                y={baseY + 22}
                anchor="middle"
                color={C.darkPoppy}
              >
                counter reset
              </Annotation>
            )}
          </g>
        )
      })}
      <Annotation
        x={640}
        y={top + 40 + 2 * 96 - 6}
        anchor="start"
        color={C.mutedInk}
      >
        rate() corrects resets within each series
      </Annotation>
    </Figure>
  )
}
