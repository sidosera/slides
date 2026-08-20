import { Figure } from "../../share"
import { Node, Arrow, Annotation, GroupLabel, Label } from "../../share"
import { C, TINT } from "../../share"

// FIGURE 04 — One series, many execution rows (major).
// Engine rows -> TimeSeriesCollapse operator -> Prometheus matrix.
const A = C.elasticBlue
const B = C.pink
const SOFT_FILL = "rgba(247,249,252,0.62)"
const SOFT_STROKE = "#edf1f6"

function Panel({
  x,
  y,
  w,
  h,
}: {
  x: number
  y: number
  w: number
  h: number
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={9}
      fill={SOFT_FILL}
      stroke={SOFT_STROKE}
      strokeWidth={0.85}
    />
  )
}

export function Figure04Collapse() {
  const rows = [
    { t: "10:00", v: "42", svc: "nginx-proxy", region: "us-west-1", c: A },
    { t: "10:01", v: "43", svc: "nginx-proxy", region: "us-west-1", c: A },
    { t: "10:02", v: "41", svc: "nginx-proxy", region: "us-east-1", c: A },
    { t: "10:00", v: "12", svc: "vllm-xlarge.service", region: "us-east-1", c: B },
    { t: "10:01", v: "14", svc: "vllm-xlarge.service", region: "us-east-1", c: B },
  ]
  const top = 96
  const tableX = 44
  const tableY = top
  const tableW = 360
  const tableHdr = 38
  const tableRowH = 30
  const tableH = tableHdr + rows.length * tableRowH
  const tableCols = [
    {
      label: "timestamp",
      x: tableX,
      w: 82,
      fill: TINT.semantic,
      color: C.darkTeal,
    },
    {
      label: "value",
      x: tableX + 82,
      w: 58,
      fill: TINT.semantic,
      color: C.darkTeal,
    },
    {
      label: "service",
      x: tableX + 140,
      w: 140,
      fill: TINT.semantic,
      color: C.darkTeal,
    },
    {
      label: "region",
      x: tableX + 280,
      w: 80,
      fill: TINT.semantic,
      color: C.darkTeal,
    },
  ]

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
      <rect
        x={tableX}
        y={tableY}
        width={tableW}
        height={tableH}
        rx={9}
        fill="rgba(255,255,255,0.86)"
        stroke={SOFT_STROKE}
        strokeWidth={0.85}
      />
      <defs>
        <clipPath id="fig04-engine-header">
          <rect x={tableX} y={tableY} width={tableW} height={tableHdr} rx={9} />
        </clipPath>
      </defs>
      <g clipPath="url(#fig04-engine-header)">
        {tableCols.map((col) => (
          <rect
            key={col.label}
            x={col.x}
            y={tableY}
            width={col.w}
            height={tableHdr}
            fill={col.fill}
            stroke="none"
          />
        ))}
      </g>
      {tableCols.map((col, i) => (
        <g key={col.label}>
          {i > 0 && (
            <line
              x1={col.x}
              y1={tableY}
              x2={col.x}
              y2={tableY + tableH}
              stroke={SOFT_STROKE}
              strokeWidth={0.65}
            />
          )}
          <Label
            x={col.x + col.w / 2}
            y={tableY + tableHdr / 2}
            color={col.color}
            size={9.5}
            weight={700}
            mono
          >
            {col.label}
          </Label>
        </g>
      ))}
      <line
        x1={tableX}
        y1={tableY + tableHdr}
        x2={tableX + tableW}
        y2={tableY + tableHdr}
        stroke={SOFT_STROKE}
        strokeWidth={0.85}
      />
      {rows.map((r, i) => {
        const rowY = tableY + tableHdr + i * tableRowH
        const y = rowY + tableRowH / 2
        return (
          <g key={i}>
            <rect
              x={tableX + 1}
              y={rowY}
              width={tableW - 2}
              height={tableRowH}
              fill={r.c}
              opacity={0.045}
              stroke="none"
            />
            {i > 0 && (
              <line
                x1={tableX}
                y1={rowY}
                x2={tableX + tableW}
                y2={rowY}
                stroke={SOFT_STROKE}
                strokeWidth={0.55}
              />
            )}
            <Label x={tableCols[0].x + tableCols[0].w / 2} y={y} color={r.c} size={11.2} mono>
              {r.t}
            </Label>
            <Label x={tableCols[1].x + tableCols[1].w / 2} y={y} color={r.c} size={11.2} mono>
              {r.v}
            </Label>
            <Label x={tableCols[2].x + tableCols[2].w / 2} y={y} color={r.c} size={9.3} mono>
              {r.svc}
            </Label>
            <Label x={tableCols[3].x + tableCols[3].w / 2} y={y} color={r.c} size={8.4} mono>
              {r.region}
            </Label>
          </g>
        )
      })}

      {/* CENTER — operator */}
      <Node
        x={420}
        y={168}
        w={196}
        h={70}
        label="TimeSeriesCollapse"
        sub="execution operator"
        variant="physical"
      />
      <Arrow x1={tableX + tableW} y1={200} x2={420} y2={200} variant="muted" />
      <Arrow x1={616} y1={200} x2={648} y2={200} variant="physical" />

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

      <Annotation x={490} y={362} color={C.mutedInk}>
        collapse values onto the requested evaluation-step grid
      </Annotation>
    </Figure>
  )
}
