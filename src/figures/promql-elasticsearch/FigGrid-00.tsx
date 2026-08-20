import { Figure } from "../../share"
import { C, FONT_MONO, TINT } from "../../share"

// FIGURE 11 — PromQL and ES|QL evaluate on different time grids.
// PromQL query_range steps are anchored to the request start; ES|QL date
// bucketing is aligned to the bucket grid.
const W = 960

const softFill = "rgba(247,249,252,0.62)"
const softStroke = "#edf1f6"
const axisStroke = "#cfd7e3"
const promFill = "rgba(8,154,150,0.14)"
const promStroke = C.teal
const esFill = "rgba(11,100,221,0.11)"
const esStroke = C.blue

const times = ["08:00", "08:05", "08:10", "08:15", "08:20", "08:25", "08:30", "08:35"]
const axisX = 148
const axisY = 96
const step = 92
const axisW = step * (times.length - 1)
const promY = 148
const esY = 254
const rowDrop = 18
const blockW = 86
const blockH = 42

function TimeLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontFamily={FONT_MONO}
      fontSize={12}
      fontWeight={650}
      fill={C.ink}
    >
      {label}
    </text>
  )
}

function WindowBlock({
  x,
  y,
  label,
  fill,
  stroke,
}: {
  x: number
  y: number
  label: string
  fill: string
  stroke: string
}) {
  return (
    <g>
      <rect
        x={x - blockW / 2}
        y={y - blockH / 2}
        width={blockW}
        height={blockH}
        rx={6}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.25}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={13}
        fontWeight={700}
        fill={stroke}
      >
        {label}
      </text>
    </g>
  )
}

export function Figure11Grid() {
  const tickX = (i: number) => axisX + i * step
  const promCenters = [2, 3, 4, 5, 6].map((i) => tickX(i) - 34)
  const esCenters = [2, 3, 4, 5, 6].map((i) => tickX(i))
  const promBlockY = (i: number) => promY + i * rowDrop
  const esBlockY = (i: number) => esY + i * rowDrop
  const promLabels = ["08:12", "08:17", "08:22", "08:27", "08:32"]
  const esLabels = ["08:10", "08:15", "08:20", "08:25", "08:30"]

  return (
    <Figure
      number="11"
      title="PromQL and ES|QL evaluate on different grids"
      subtitle="PromQL range queries advance from the requested start time. ES|QL bucketed time series align to the bucket grid, so the same step can land on different timestamps."
      width={W}
      height={430}
    >
      <rect
        x={64}
        y={62}
        width={832}
        height={306}
        rx={10}
        fill={softFill}
        stroke={softStroke}
        strokeWidth={0.85}
      />

      {times.map((time, i) => {
        const x = tickX(i)
        return (
          <g key={time}>
            <TimeLabel x={x} y={50} label={time} />
            <line
              x1={x}
        y1={70}
        x2={x}
        y2={346}
              stroke={axisStroke}
              strokeWidth={1}
              strokeDasharray="3 6"
            />
          </g>
        )
      })}

      <line
        x1={axisX - 76}
        y1={axisY}
        x2={axisX + axisW + 68}
        y2={axisY}
        stroke={C.darkGray}
        strokeWidth={1}
        opacity={0.65}
      />
      {Array.from({ length: 20 }).map((_, i) => (
        <circle
          key={i}
          cx={axisX + i * (axisW / 19)}
          cy={axisY}
          r={4}
          fill={C.blue}
          opacity={0.72}
        />
      ))}

      <text
        x={92}
        y={promY + 8}
        textAnchor="start"
        fontSize={18}
        fontWeight={760}
        fill={C.ink}
      >
        PromQL
      </text>
      <text
        x={92}
        y={esY + 8}
        textAnchor="start"
        fontSize={18}
        fontWeight={760}
        fill={C.ink}
      >
        ES|QL
      </text>

      {promCenters.map((x, i) => (
        <WindowBlock
          key={promLabels[i]}
          x={x}
          y={promBlockY(i)}
          label={promLabels[i]}
          fill={promFill}
          stroke={promStroke}
        />
      ))}
      {esCenters.map((x, i) => (
        <WindowBlock
          key={esLabels[i]}
          x={x}
          y={esBlockY(i)}
          label={esLabels[i]}
          fill={esFill}
          stroke={esStroke}
        />
      ))}

    </Figure>
  )
}
