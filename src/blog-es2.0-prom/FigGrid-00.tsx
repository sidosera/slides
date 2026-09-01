import { Figure } from "../share"
import { C, FONT_MONO, TINT } from "../share"

// FIGURE 11 — PromQL and ES|QL evaluate on different time grids.
// PromQL query_range buckets are anchored to request start plus step. ES|QL
// date buckets are aligned to bucket boundaries. Both can cross request bounds.
const W = 960

const gridStroke = "rgba(171,180,196,0.3)"
const laneRule = "rgba(171,180,196,0.22)"

const axisX = 128
const axisY = 96
const tickStep = 92
const axisW = tickStep * 7
const tickMinutes = [0, 5, 10, 15, 20, 25, 30, 35]
const tickLabels = [
  "08:00",
  "08:05",
  "08:10",
  "08:15",
  "08:20",
  "08:25",
  "08:30",
  "08:35",
]

const xForMinute = (minute: number) => axisX + (minute / 5) * tickStep

function LaneLabel({ x, y, title }: { x: number y: number title: string }) {
  return (
    <g>
      <text x={x} y={y} fontSize={15.5} fontWeight={780} fill={C.ink}>
        {title}
      </text>
    </g>
  )
}

function TimeTick({ minute, label }: { minute: number label: string }) {
  const x = xForMinute(minute)
  return (
    <g>
      <line
        x1={x}
        y1={70}
        x2={x}
        y2={236}
        stroke={gridStroke}
        strokeDasharray="2 8"
        strokeWidth={0.8}
      />
      <text
        x={x}
        y={52}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={11}
        fontWeight={620}
        fill={C.ink}
      >
        {label}
      </text>
    </g>
  )
}

function RequestBound({ minute, label }: { minute: number label: string }) {
  const x = xForMinute(minute)
  return (
    <g>
      <line
        x1={x}
        y1={28}
        x2={x}
        y2={238}
        stroke={C.pink}
        strokeWidth={1.35}
        strokeDasharray="5 7"
        opacity={0.78}
      />
      <text
        x={x}
        y={14}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={10.6}
        fontWeight={780}
        fill={C.pink}
      >
        {label}
      </text>
    </g>
  )
}

function PromBucket({ start, index }: { start: number index: number }) {
  const x = xForMinute(start)
  const y = 128
  const w = tickStep

  return (
    <g>
      <rect
        x={x}
        y={y - 19}
        width={w}
        height={38}
        fill={TINT.semantic}
        stroke={C.teal}
        strokeOpacity={index === 0 ? 0.72 : 0.42}
        strokeWidth={0.9}
      />
      <line
        x1={x}
        y1={y - 22}
        x2={x}
        y2={y + 22}
        stroke={C.teal}
        strokeWidth={1}
        opacity={0.34}
      />
      <text
        x={x + w / 2}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={10.5}
        fontWeight={700}
        fill={C.darkTeal}
      >
        {`08:${String(12 + index * 5).padStart(2, "0")}`}
      </text>
    </g>
  )
}

function Bucket({ minute, index }: { minute: number index: number }) {
  const x = xForMinute(minute)
  const y = 194
  const w = tickStep

  return (
    <g>
      <rect
        x={x}
        y={y - 19}
        width={w}
        height={38}
        fill={TINT.physical}
        stroke={C.blue}
        strokeOpacity={index === 0 ? 0.72 : 0.36}
        strokeWidth={0.9}
      />
      <line
        x1={x}
        y1={y - 22}
        x2={x}
        y2={y + 22}
        stroke={C.blue}
        strokeWidth={1}
        opacity={0.34}
      />
      <text
        x={x + w / 2}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={10.5}
        fontWeight={700}
        fill={C.darkBlue}
      >
        {`08:${String(10 + index * 5).padStart(2, "0")}`}
      </text>
    </g>
  )
}

export function Figure11Grid() {
  const promMinutes = [12, 17, 22, 27, 32]
  const bucketMinutes = [10, 15, 20, 25, 30]
  const requestStart = 12
  const requestEnd = 33.5

  return (
    <Figure
      number="11"
      title="TBUCKET <> TSTEP"
      subtitle="PromQL query_range buckets advance from the requested start. ES|QL date buckets align to bucket boundaries, so an offset request can cut through both grids."
      width={W}
      height={270}
    >
      {tickMinutes.map((minute, i) => (
        <TimeTick key={minute} minute={minute} label={tickLabels[i]} />
      ))}

      <line
        x1={axisX - 54}
        y1={axisY}
        x2={axisX + axisW + 54}
        y2={axisY}
        stroke={C.darkGray}
        strokeWidth={0.95}
        opacity={0.5}
      />
      <line
        x1={axisX - 54}
        y1={160}
        x2={axisX + axisW + 54}
        y2={160}
        stroke={laneRule}
        strokeWidth={0.8}
      />
      <RequestBound minute={requestStart} label="start" />
      <RequestBound minute={requestEnd} label="end" />

      <LaneLabel x={82} y={128} title="TSTEP" />
      <LaneLabel x={82} y={194} title="TBUCKET" />

      {promMinutes.map((minute, i) => (
        <PromBucket key={minute} start={minute} index={i} />
      ))}

      {bucketMinutes.map((minute, i) => (
        <Bucket key={minute} minute={minute} index={i} />
      ))}
    </Figure>
  )
}
