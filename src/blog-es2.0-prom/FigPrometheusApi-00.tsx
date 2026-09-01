import { Figure } from "../share"
import { C, FONT_MONO, TINT } from "../share"

// FIGURE 14 — Native Prometheus ingest and query APIs in Elasticsearch.
// Two Prometheus-compatible HTTP paths enter the same Elasticsearch server:
// Remote Write maps directly into TSDS; query APIs execute on the shared engine.
const W = 980

const softFill = "rgba(247,249,252,0.62)"
const softStroke = "#edf1f6"
const panelStroke = "#dfe5ee"
const apiFill = "rgba(255,255,255,0.86)"

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = C.darkGray,
  width = 1.25,
  opacity = 0.72,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color?: string
  width?: number
  opacity?: number
}) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const head = 5.4
  const half = 3.4
  const bx = x2 - ux * head
  const by = y2 - uy * head
  const px = -uy * half
  const py = ux * half

  return (
    <g opacity={opacity}>
      <line
        x1={x1}
        y1={y1}
        x2={bx}
        y2={by}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      <polygon
        points={`${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`}
        fill={color}
      />
    </g>
  )
}

function GroupTitle({
  x,
  y,
  children,
}: {
  x: number
  y: number
  children: string
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="start"
      fontSize={13}
      fontWeight={820}
      letterSpacing={1.25}
      fill={C.ink}
    >
      {children}
    </text>
  )
}

function Node({
  x,
  y,
  w,
  h,
  label,
  sub,
  stroke = panelStroke,
  fill = apiFill,
  color = C.ink,
  mono,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  sub?: string
  stroke?: string
  fill?: string
  color?: string
  mono?: boolean
}) {
  const cx = x + w / 2
  const cy = y + h / 2

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
      />
      <text
        x={cx}
        y={sub ? cy - 6 : cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={mono ? FONT_MONO : undefined}
        fontSize={12.4}
        fontWeight={680}
        fill={color}
      >
        {label}
      </text>
      {sub && (
        <text
          x={cx}
          y={cy + 11}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={mono ? FONT_MONO : undefined}
          fontSize={8.8}
          fontWeight={560}
          fill={C.mutedInk}
        >
          {sub}
        </text>
      )}
    </g>
  )
}

function TransformPanel({
  x,
  y,
  items,
}: {
  x: number
  y: number
  items: readonly string[]
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={188}
        height={116}
        fill="rgba(255,255,255,0.72)"
        stroke={panelStroke}
        strokeWidth={0.85}
      />
      {items.map((item, i) => (
        <g key={item}>
          <circle
            cx={x + 16}
            cy={y + 24 + i * 22}
            r={3.2}
            fill={C.teal}
            opacity={0.68}
          />
          <text
            x={x + 28}
            y={y + 24 + i * 22}
            dominantBaseline="central"
            fontSize={10.2}
            fontWeight={560}
            fill={C.mutedInk}
          >
            {item}
          </text>
        </g>
      ))}
    </g>
  )
}

export function Figure14PrometheusApis() {
  const laneIngestY = 164
  const laneQueryY = 324

  return (
    <Figure
      number="14"
      title="Prometheus APIs are built into Elasticsearch"
      subtitle="Elasticsearch accepts Prometheus Remote Write directly and exposes Prometheus query APIs directly, removing the need for a separate adapter while keeping ingest, storage, and query execution in one server."
      width={W}
      height={540}
    >
      <GroupTitle x={52} y={70}>
        PROMETHEUS
      </GroupTitle>
      <rect
        x={52}
        y={92}
        width={174}
        height={284}
        fill={softFill}
        stroke={softStroke}
        strokeWidth={0.85}
      />
      <Node
        x={76}
        y={laneIngestY - 28}
        w={126}
        h={56}
        label="Remote Write"
        sub="snappy ProtoBuf"
        stroke={C.teal}
        fill={TINT.semantic}
        color={C.darkTeal}
        mono
      />
      <Node
        x={76}
        y={laneQueryY - 28}
        w={126}
        h={56}
        label="Query API"
        sub="PromQL / range"
        stroke={C.blue}
        fill={TINT.physical}
        color={C.darkBlue}
        mono
      />

      <rect
        x={246}
        y={54}
        width={682}
        height={374}
        fill={softFill}
        stroke={softStroke}
        strokeWidth={0.85}
      />
      <GroupTitle x={270} y={82}>
        ELASTICSEARCH SERVER
      </GroupTitle>

      <text
        x={218}
        y={250}
        textAnchor="end"
        fontSize={10.5}
        fontWeight={650}
        letterSpacing={0.6}
        fill={C.faintInk}
      >
        no adapter
      </text>

      <Node
        x={278}
        y={laneIngestY - 31}
        w={142}
        h={62}
        label="Prometheus"
        sub="HTTP ingest endpoint"
        stroke={C.teal}
        fill={apiFill}
        color={C.darkTeal}
      />
      <Arrow
        x1={202}
        y1={laneIngestY}
        x2={278}
        y2={laneIngestY}
        color={C.teal}
        width={1.35}
      />

      <TransformPanel
        x={454}
        y={laneIngestY - 58}
        items={[
          "labels -> TSDS dimensions",
          "name/value -> metric fields",
          "infer counter or gauge",
          "dynamic template",
        ]}
      />
      <Arrow
        x1={420}
        y1={laneIngestY}
        x2={454}
        y2={laneIngestY}
        color={C.darkGray}
      />

      <Node
        x={688}
        y={laneIngestY - 31}
        w={150}
        h={62}
        label="TSDS"
        sub="direct indexed writes"
        stroke={C.teal}
        fill={TINT.semantic}
        color={C.darkTeal}
        mono
      />
      <Arrow
        x1={642}
        y1={laneIngestY}
        x2={688}
        y2={laneIngestY}
        color={C.teal}
        width={1.35}
      />

      <Node
        x={278}
        y={laneQueryY - 31}
        w={142}
        h={62}
        label="Prometheus"
        sub="HTTP query endpoint"
        stroke={C.blue}
        fill={apiFill}
        color={C.darkBlue}
      />
      <Arrow
        x1={202}
        y1={laneQueryY}
        x2={278}
        y2={laneQueryY}
        color={C.blue}
        width={1.35}
      />

      <Node
        x={454}
        y={laneQueryY - 31}
        w={142}
        h={62}
        label="PromQL"
        sub="compiler"
        stroke={C.darkGray}
        fill="rgba(255,255,255,0.72)"
        color={C.ink}
        mono
      />
      <Arrow
        x1={420}
        y1={laneQueryY}
        x2={454}
        y2={laneQueryY}
        color={C.darkGray}
      />

      <Node
        x={638}
        y={laneQueryY - 31}
        w={150}
        h={62}
        label="Shared engine"
        sub="planner + execution"
        stroke={C.blue}
        fill={TINT.physical}
        color={C.darkBlue}
      />
      <Arrow
        x1={596}
        y1={laneQueryY}
        x2={638}
        y2={laneQueryY}
        color={C.blue}
        width={1.35}
      />

      <Node
        x={826}
        y={laneQueryY - 31}
        w={70}
        h={62}
        label="JSON"
        sub="response"
        stroke={panelStroke}
        fill="rgba(255,255,255,0.72)"
        color={C.mutedInk}
        mono
      />
      <Arrow
        x1={788}
        y1={laneQueryY}
        x2={826}
        y2={laneQueryY}
        color={C.blue}
        width={1.35}
      />

      <line
        x1={270}
        y1={244}
        x2={906}
        y2={244}
        stroke={softStroke}
        strokeWidth={1}
      />
      <text
        x={270}
        y={126}
        fontSize={11}
        fontWeight={760}
        letterSpacing={1}
        fill={C.faintInk}
      >
        INGEST
      </text>
      <text
        x={270}
        y={286}
        fontSize={11}
        fontWeight={760}
        letterSpacing={1}
        fill={C.faintInk}
      >
        QUERY
      </text>
    </Figure>
  )
}
