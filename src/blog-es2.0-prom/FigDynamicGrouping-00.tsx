import { Figure } from "../share"
import { C, FONT_MONO, TINT } from "../share"

// FIGURE 17 — Dynamic grouping columns for PromQL without(...).
const W = 1040
const H = 520

const line = "rgba(171,180,196,0.55)"
const grid = "rgba(171,180,196,0.28)"

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = C.darkGray,
  opacity = 0.7,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color?: string
  opacity?: number
}) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const head = 6
  const bx = x2 - ux * head
  const by = y2 - uy * head
  const px = -uy * 3.4
  const py = ux * 3.4

  return (
    <g opacity={opacity}>
      <line
        x1={x1}
        y1={y1}
        x2={bx}
        y2={by}
        stroke={color}
        strokeWidth={1.25}
        strokeLinecap="round"
      />
      <polygon
        points={`${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`}
        fill={color}
      />
    </g>
  )
}

function Mono({
  x,
  y,
  children,
  size = 10.5,
  color = C.ink,
  weight = 720,
  anchor = "start",
}: {
  x: number
  y: number
  children: string
  size?: number
  color?: string
  weight?: number
  anchor?: "start" | "middle" | "end"
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={FONT_MONO}
      fontSize={size}
      fontWeight={weight}
      fill={color}
    >
      {children}
    </text>
  )
}

function Label({
  x,
  y,
  children,
  color = C.mutedInk,
}: {
  x: number
  y: number
  children: string
  color?: string
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={10.8}
      fontWeight={680}
      letterSpacing={0.75}
      fill={color}
    >
      {children}
    </text>
  )
}

function Token({
  x,
  y,
  w,
  label,
  tone,
  muted,
}: {
  x: number
  y: number
  w: number
  label: string
  tone: "semantic" | "physical" | "excluded" | "neutral"
  muted?: boolean
}) {
  const style = {
    semantic: { fill: TINT.semantic, stroke: C.teal, text: C.darkTeal },
    physical: { fill: TINT.physical, stroke: C.blue, text: C.darkBlue },
    excluded: {
      fill: "rgba(250,116,78,0.055)",
      stroke: C.poppy,
      text: C.darkPoppy,
    },
    neutral: { fill: "transparent", stroke: C.darkGray, text: C.mutedInk },
  }[tone]

  return (
    <g opacity={muted ? 0.44 : 1}>
      <rect
        x={x}
        y={y}
        width={w}
        height={28}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={0.9}
        strokeDasharray={tone === "excluded" ? "4 4" : undefined}
      />
      <text
        x={x + w / 2}
        y={y + 14}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={9.2}
        fontWeight={720}
        fill={style.text}
      >
        {label}
      </text>
      {tone === "excluded" && (
        <line
          x1={x + 7}
          y1={y + 20}
          x2={x + w - 7}
          y2={y + 8}
          stroke={C.poppy}
          strokeWidth={1.1}
          opacity={0.8}
        />
      )}
    </g>
  )
}

function KeyTuple({
  x,
  y,
  items,
  color = C.teal,
}: {
  x: number
  y: number
  items: string[]
  color?: string
}) {
  const widths = items.map((item) => Math.max(58, item.length * 7.2 + 18))
  let offset = 0

  return (
    <g>
      {items.map((item, i) => {
        const w = widths[i]
        const node = (
          <Token
            key={item}
            x={x + offset}
            y={y}
            w={w}
            label={item}
            tone={color === C.blue ? "physical" : "semantic"}
          />
        )
        offset += w - 1
        return node
      })}
    </g>
  )
}

function StaticSchema() {
  return (
    <g>
      <Label x={68} y={74}>
        ES|QL: GROUPING SCHEMA IS KNOWN
      </Label>
      <Mono x={68} y={104} size={12.2}>
        STATS sum(x) BY cluster, namespace
      </Mono>
      <Arrow
        x1={302}
        y1={126}
        x2={302}
        y2={158}
        color={C.darkGray}
        opacity={0.55}
      />
      <KeyTuple x={188} y={168} items={["cluster", "namespace"]} />
      <text
        x={302}
        y={224}
        textAnchor="middle"
        fontSize={10.8}
        fontWeight={650}
        fill={C.mutedInk}
      >
        planner receives the key shape directly
      </text>
    </g>
  )
}

function DiscoveryFirst() {
  const labels = [
    "cluster",
    "namespace",
    "region",
    "service",
    "team",
    "instance",
    "pod",
    "zone",
    "version",
  ]

  return (
    <g>
      <Label x={574} y={74}>
        DISCOVERY-FIRST REWRITE
      </Label>
      <Mono x={574} y={104} size={12.2}>
        sum without(instance, pod)
      </Mono>
      <Arrow
        x1={732}
        y1={126}
        x2={732}
        y2={154}
        color={C.darkGray}
        opacity={0.5}
      />
      <text x={574} y={160} fontSize={10.5} fontWeight={650} fill={C.mutedInk}>
        discover label universe
      </text>
      {labels.map((label, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const excluded = label === "instance" || label === "pod"

        return (
          <Token
            key={label}
            x={574 + col * 102}
            y={178 + row * 36}
            w={88}
            label={label}
            tone={excluded ? "excluded" : "neutral"}
            muted={!excluded}
          />
        )
      })}
      <Arrow
        x1={732}
        y1={292}
        x2={732}
        y2={324}
        color={C.darkGray}
        opacity={0.45}
      />
      <rect
        x={576}
        y={340}
        width={312}
        height={34}
        fill="rgba(250,116,78,0.035)"
        stroke={C.poppy}
        strokeWidth={0.9}
        strokeDasharray="5 5"
      />
      <Mono x={732} y={361} size={9.3} color={C.darkPoppy} anchor="middle">
        by(cluster, namespace, region, service, team, zone, version, ...)
      </Mono>
      <text
        x={732}
        y={404}
        textAnchor="middle"
        fontSize={10.8}
        fontWeight={650}
        fill={C.mutedInk}
      >
        wide sparse key before planning
      </text>
    </g>
  )
}

function SeriesRow({
  y,
  name,
  labels,
  keyLabels,
}: {
  y: number
  name: string
  labels: { label: string excluded?: boolean muted?: boolean }[]
  keyLabels: string[]
}) {
  return (
    <g>
      <Mono x={82} y={y + 18} size={10.5} color={C.ink}>
        {name}
      </Mono>
      {labels.map((item, i) => (
        <Token
          key={`${name}-${item.label}`}
          x={154 + i * 86}
          y={y}
          w={74}
          label={item.label}
          tone={
            item.excluded ? "excluded" : item.muted ? "neutral" : "semantic"
          }
          muted={item.muted}
        />
      ))}
      <Arrow
        x1={506}
        y1={y + 14}
        x2={552}
        y2={y + 14}
        color={C.darkGray}
        opacity={0.52}
      />
      <KeyTuple x={574} y={y} items={keyLabels} color={C.teal} />
    </g>
  )
}

function DynamicGrouping() {
  return (
    <g>
      <Label x={68} y={306}>
        DYNAMIC GROUPING COLUMNS
      </Label>
      <Mono x={68} y={334} size={12.2}>
        exclude(instance, pod) while reading each series
      </Mono>
      <line x1={68} y1={356} x2={940} y2={356} stroke={line} strokeWidth={1} />
      <text x={154} y={378} fontSize={10.2} fontWeight={680} fill={C.mutedInk}>
        series labels loaded from TSDS
      </text>
      <text x={574} y={378} fontSize={10.2} fontWeight={680} fill={C.mutedInk}>
        grouping key emitted by the reader
      </text>
      <SeriesRow
        y={394}
        name="S1"
        labels={[
          { label: "cluster" },
          { label: "namespace" },
          { label: "instance", excluded: true },
          { label: "pod", excluded: true },
        ]}
        keyLabels={["cluster", "namespace"]}
      />
      <SeriesRow
        y={434}
        name="S2"
        labels={[
          { label: "cluster" },
          { label: "service" },
          { label: "region" },
          { label: "pod", excluded: true },
        ]}
        keyLabels={["cluster", "service", "region"]}
      />
    </g>
  )
}

export function Figure17DynamicGrouping() {
  return (
    <Figure
      number="17"
      title="Dynamic grouping columns avoid schema discovery"
      subtitle="PromQL without(...) names excluded labels, not the complete grouping schema. Dynamic grouping lets the reader build the key from each time series after applying exclusions, avoiding a discovery phase and a wide sparse aggregation key."
      width={W}
      height={H}
    >
      <line x1={512} y1={54} x2={512} y2={258} stroke={grid} strokeWidth={1} />
      <StaticSchema />
      <DiscoveryFirst />
      <DynamicGrouping />
    </Figure>
  )
}
