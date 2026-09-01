import { Figure } from "../share"
import {
  Edge,
  Annotation,
  GroupLabel,
  Label,
  Chip,
  Arrow,
  Node,
} from "../share"
import { C, TINT } from "../share"

// FIGURE 10 — offset moves selector evaluation (light).
// Two timelines sharing the same evaluation timestamp T.
export function Figure10Offset() {
  const Tx = 792
  const axL = 120
  const axR = 860
  const softFill = "rgba(247,249,252,0.62)"
  const softStroke = "#edf1f6"

  const Marker = ({
    x,
    y,
    label,
    color = C.ink,
  }: {
    x: number
    y: number
    label: string
    color?: string
  }) => (
    <g>
      <line
        x1={x}
        y1={y - 7}
        x2={x}
        y2={y + 7}
        stroke={color}
        strokeWidth={1.25}
      />
      <Label x={x} y={y + 22} color={color} size={11} mono>
        {label}
      </Label>
    </g>
  )

  const Window = ({ x1, x2, y }: { x1: number x2: number y: number }) => (
    <g>
      <rect
        x={x1}
        y={y - 12}
        width={x2 - x1}
        height={24}
        fill="rgba(8,154,150,0.055)"
        stroke={C.teal}
        strokeWidth={1}
      />
      <Label x={(x1 + x2) / 2} y={y} color={C.darkTeal} size={11} weight={650}>
        5m window
      </Label>
    </g>
  )

  return (
    <Figure
      number="10"
      title="offset shifts selector evaluation, not the result"
      subtitle="rate(http_requests_total[5m] offset 1h) keeps its evaluation at T. Only the selector's source window slides back by one hour."
      width={960}
      height={410}
    >
      <Chip
        x={120}
        y={44}
        text="rate(http_requests_total[5m] offset 1h)"
        anchor="start"
        size={11}
        color={C.darkTeal}
      />

      <rect
        x={96}
        y={106}
        width={788}
        height={78}
        fill={softFill}
        stroke={softStroke}
        strokeWidth={0.85}
      />
      <rect
        x={96}
        y={226}
        width={788}
        height={78}
        fill={softFill}
        stroke={softStroke}
        strokeWidth={0.85}
      />

      {/* shared evaluation guide */}
      <line
        x1={Tx}
        y1={90}
        x2={Tx}
        y2={326}
        stroke={C.darkGray}
        strokeWidth={1.05}
        strokeDasharray="3 5"
        opacity={0.62}
      />
      <Label x={Tx} y={86} color={C.ink} size={12} weight={700}>
        output timestamp T
      </Label>

      <Node
        x={642}
        y={338}
        w={238}
        h={38}
        label="result is still emitted at T"
        variant="semantic"
      />

      {/* NORMAL */}
      <GroupLabel x={axL} y={118}>
        NORMAL SELECTOR
      </GroupLabel>
      <Edge
        x1={axL}
        y1={150}
        x2={axR}
        y2={150}
        color={C.mediumGray}
        width={1.15}
      />
      <Window x1={684} x2={Tx} y={150} />
      <Marker x={692} y={150} label="T-5m" />
      <Marker x={Tx} y={150} label="T" color={C.darkTeal} />

      {/* OFFSET */}
      <GroupLabel x={axL} y={238}>
        OFFSET 1h
      </GroupLabel>
      <Edge
        x1={axL}
        y1={270}
        x2={axR}
        y2={270}
        color={C.mediumGray}
        width={1.15}
      />
      <Window x1={300} x2={392} y={270} />
      <Marker x={300} y={270} label="T-1h-5m" />
      <Marker x={392} y={270} label="T-1h" />
      <Marker x={Tx} y={270} label="T" color={C.darkTeal} />
      <Edge
        x1={392}
        y1={270}
        x2={Tx - 4}
        y2={270}
        color={C.darkGray}
        width={0.9}
        dashed
      />

      <Arrow x1={684} y1={184} x2={392} y2={246} variant="muted" />
      <Annotation x={524} y={202} color={C.darkTeal} size={13}>
        offset moves only the selector range
      </Annotation>

      <Annotation x={480} y={386} color={C.mutedInk}>
        query evaluation stays fixed; data lookup slides back by one hour
      </Annotation>
    </Figure>
  )
}
