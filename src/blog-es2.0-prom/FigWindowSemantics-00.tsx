import { Figure } from "../share"
import { C, FONT_MONO, TINT } from "../share"

// FIGURE 15 — Window semantics for time-series aggregates.
const W = 980
const H = 500

const gridStroke = "rgba(171,180,196,0.32)"
const axisStroke = "rgba(171,180,196,0.72)"

const axisX = 192
const axisY = 154
const axisW = 660
const step = axisW / 6
const rowYs = [222, 296, 370]
const buckets = [
  { label: "T1", index: 2, width: 2 },
  { label: "T2", index: 3, width: 2 },
  { label: "T3", index: 4, width: 2 },
]

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = C.darkGray,
  opacity = 0.68,
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

function TimeGrid() {
  return (
    <g>
      <line
        x1={axisX}
        y1={axisY}
        x2={axisX + axisW}
        y2={axisY}
        stroke={axisStroke}
        strokeWidth={1.05}
      />
      <text
        x={axisX + axisW + 22}
        y={axisY + 3}
        fontSize={10.4}
        fontWeight={620}
        fill={C.mutedInk}
      >
        @timestamp
      </text>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const x = axisX + i * step

        return (
          <g key={i}>
            <line
              x1={x}
              y1={axisY - 8}
              x2={x}
              y2={412}
              stroke={gridStroke}
              strokeWidth={0.9}
            />
            <circle
              cx={x}
              cy={axisY}
              r={2.9}
              fill={C.darkGray}
              opacity={0.58}
            />
          </g>
        )
      })}
      {buckets.map((bucket) => {
        const x = axisX + bucket.index * step

        return (
          <g key={bucket.label}>
            <line
              x1={x}
              y1={axisY - 18}
              x2={x}
              y2={412}
              stroke={C.ink}
              strokeWidth={0.95}
              strokeDasharray="4 7"
              opacity={0.3}
            />
            <text
              x={x}
              y={axisY - 26}
              textAnchor="middle"
              fontFamily={FONT_MONO}
              fontSize={11.2}
              fontWeight={780}
              fill={C.ink}
            >
              {bucket.label}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function RowLabel({ label, y }: { label: string y: number }) {
  return (
    <g>
      <text
        x={118}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={10.6}
        fontWeight={780}
        fill={C.ink}
      >
        {`BUCKET ${label}`}
      </text>
    </g>
  )
}

function WindowRow({
  bucket,
  y,
  mode,
  variable,
}: {
  bucket: { label: string index: number width: number }
  y: number
  mode: "forward" | "trailing"
  variable?: boolean
}) {
  const labelX = axisX + bucket.index * step
  const width = (variable ? 2.55 : bucket.width) * step
  const x = mode === "forward" ? labelX : labelX - width
  const color = mode === "forward" ? C.poppy : C.teal
  const fill = mode === "forward" ? "rgba(250,116,78,0.06)" : TINT.semantic
  const text =
    mode === "forward"
      ? `[${bucket.label}, ${bucket.label} + W)`
      : `(${bucket.label} - W, ${bucket.label}]`

  return (
    <g>
      <RowLabel label={bucket.label} y={y} />
      <line
        x1={axisX}
        y1={y}
        x2={axisX + axisW}
        y2={y}
        stroke={axisStroke}
        strokeWidth={0.95}
        opacity={0.36}
      />
      <rect
        x={x}
        y={y - 19}
        width={width}
        height={38}
        fill={fill}
        stroke={color}
        strokeWidth={1.1}
        strokeDasharray={mode === "forward" ? "5 5" : undefined}
      />
      {variable && (
        <g>
          <rect
            x={x}
            y={y - 19}
            width={0.55 * step}
            height={38}
            fill="rgba(8,154,150,0.11)"
            stroke={C.teal}
            strokeWidth={0.8}
          />
          <text
            x={x + 0.275 * step}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily={FONT_MONO}
            fontSize={9.2}
            fontWeight={780}
            fill={C.darkTeal}
          >
            δ
          </text>
        </g>
      )}
      <text
        x={x + width / 2}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10.4}
        fontWeight={720}
        fill={color}
      >
        {text}
      </text>
      <circle cx={labelX} cy={y} r={5} fill={color} opacity={0.82} />
      {mode === "forward" ? (
        <Arrow
          x1={labelX + 12}
          y1={y - 29}
          x2={x + width - 12}
          y2={y - 29}
          color={C.poppy}
          opacity={0.62}
        />
      ) : (
        <Arrow
          x1={labelX - 12}
          y1={y - 29}
          x2={x + 12}
          y2={y - 29}
          color={C.teal}
          opacity={0.76}
        />
      )}
    </g>
  )
}

function StackDiagram({
  mode,
  variableLast,
}: {
  mode: "forward" | "trailing"
  variableLast?: boolean
}) {
  return (
    <g>
      <TimeGrid />
      {buckets.map((bucket, i) => (
        <WindowRow
          key={bucket.label}
          bucket={bucket}
          y={rowYs[i]}
          mode={mode}
          variable={variableLast && i === 1}
        />
      ))}
    </g>
  )
}

function TechniqueBucket({
  x,
  y,
  w,
  label,
  tone,
}: {
  x: number
  y: number
  w: number
  label: string
  tone: "muted" | "full" | "label"
}) {
  const style = {
    muted: { fill: "transparent", stroke: C.darkGray, opacity: 0.55 },
    full: { fill: TINT.physical, stroke: C.blue, opacity: 1 },
    label: { fill: TINT.semantic, stroke: C.teal, opacity: 1 },
  }[tone]

  return (
    <g opacity={style.opacity}>
      <rect
        x={x}
        y={y}
        width={w}
        height={54}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={1.05}
      />
      <text
        x={x + w / 2}
        y={y + 27}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={10.8}
        fontWeight={760}
        fill={style.stroke}
      >
        {label}
      </text>
    </g>
  )
}

function TechniqueState({
  x,
  y,
  w,
  label,
  tone,
}: {
  x: number
  y: number
  w: number
  label: string
  tone: "partial" | "full" | "final"
}) {
  const style = {
    partial: { fill: TINT.semantic, stroke: C.teal },
    full: { fill: TINT.physical, stroke: C.blue },
    final: { fill: "transparent", stroke: C.ink },
  }[tone]

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={42}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={1}
      />
      <text
        x={x + w / 2}
        y={y + 21}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={10.3}
        fontWeight={720}
        fill={style.stroke}
      >
        {label}
      </text>
    </g>
  )
}

function VariableTechniqueDiagram() {
  const x = 92
  const bucketW = 150
  const bucketH = 54
  const gap = 0
  const b0 = x + 118
  const rowY = 244
  const labelX = b0 + bucketW * 3
  const partialW = 52
  const fullW = bucketW * 2

  return (
    <g>
      <text
        x={86}
        y={190}
        fontFamily={FONT_MONO}
        fontSize={12.8}
        fontWeight={780}
        fill={C.ink}
      >
        W = T * K + δ
      </text>

      <line
        x1={b0}
        y1={rowY - 34}
        x2={b0 + bucketW * 4}
        y2={rowY - 34}
        stroke={axisStroke}
        strokeWidth={1.05}
      />
      {[0, 1, 2, 3, 4].map((i) => {
        const tickX = b0 + i * bucketW

        return (
          <g key={i}>
            <line
              x1={tickX}
              y1={rowY - 44}
              x2={tickX}
              y2={rowY + 142}
              stroke={i === 3 ? C.teal : gridStroke}
              strokeWidth={i === 3 ? 1 : 0.9}
              strokeDasharray={i === 3 ? "4 7" : undefined}
              opacity={i === 3 ? 0.55 : 1}
            />
            <circle
              cx={tickX}
              cy={rowY - 34}
              r={2.8}
              fill={i === 3 ? C.teal : C.darkGray}
              opacity={0.62}
            />
          </g>
        )
      })}
      <text
        x={labelX}
        y={rowY - 60}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={11.2}
        fontWeight={780}
        fill={C.ink}
      >
        T3
      </text>

      <TechniqueBucket x={b0} y={rowY} w={bucketW} label="T0" tone="muted" />
      <TechniqueBucket
        x={b0 + bucketW + gap}
        y={rowY}
        w={bucketW}
        label="T1"
        tone="full"
      />
      <TechniqueBucket
        x={b0 + bucketW * 2 + gap}
        y={rowY}
        w={bucketW}
        label="T2"
        tone="full"
      />
      <TechniqueBucket
        x={b0 + bucketW * 3 + gap}
        y={rowY}
        w={bucketW}
        label="T3"
        tone="label"
      />

      <rect
        x={labelX - fullW - partialW}
        y={rowY - 28}
        width={partialW}
        height={18}
        fill={TINT.semantic}
        stroke={C.teal}
        strokeWidth={0.9}
      />
      <text
        x={labelX - fullW - partialW / 2}
        y={rowY - 19}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={8.8}
        fontWeight={780}
        fill={C.darkTeal}
      >
        δ
      </text>
      <rect
        x={labelX - fullW}
        y={rowY - 28}
        width={fullW}
        height={18}
        fill="rgba(11,100,221,0.075)"
        stroke={C.blue}
        strokeWidth={0.9}
      />
      <text
        x={labelX - fullW / 2}
        y={rowY - 19}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={8.8}
        fontWeight={780}
        fill={C.darkBlue}
      >
        K FULL BUCKETS
      </text>

      <Arrow
        x1={labelX - 8}
        y1={rowY + bucketH + 18}
        x2={labelX - 178}
        y2={rowY + bucketH + 18}
        color={C.teal}
        opacity={0.78}
      />
      <text
        x={labelX - 86}
        y={rowY + bucketH + 8}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={9.3}
        fontWeight={760}
        fill={C.darkTeal}
      >
        (T3 - W, T3]
      </text>

      <TechniqueState
        x={b0 + 16}
        y={rowY + 96}
        w={130}
        label="partial δ"
        tone="partial"
      />
      <TechniqueState
        x={b0 + 178}
        y={rowY + 96}
        w={146}
        label="full states"
        tone="full"
      />
      <TechniqueState
        x={b0 + 364}
        y={rowY + 96}
        w={108}
        label="FINAL"
        tone="final"
      />
      <Arrow
        x1={b0 + 146}
        y1={rowY + 117}
        x2={b0 + 178}
        y2={rowY + 117}
        color={C.darkGray}
        opacity={0.56}
      />
      <Arrow
        x1={b0 + 324}
        y1={rowY + 117}
        x2={b0 + 364}
        y2={rowY + 117}
        color={C.darkGray}
        opacity={0.56}
      />
    </g>
  )
}

export function Figure15OldWindowSemantics() {
  return (
    <Figure
      number="15a"
      title="Old window behavior made bucket labels look forward"
      subtitle="Each output bucket label was paired with a physical read window after that label, so the right edge of a chart depended on samples that had not happened yet."
      width={W}
      height={H}
    >
      <StackDiagram mode="forward" />
    </Figure>
  )
}

export function Figure15VariableWindowTechnique() {
  return (
    <Figure
      number="15c"
      title="Variable window sizes use full buckets plus a boundary partial"
      subtitle="When the requested window is not a multiple of the bucket size, the physical plan decomposes it per aggregate instead of forcing the whole query onto a tiny global sub-bucket grid."
      width={W}
      height={H}
    >
      <VariableTechniqueDiagram />
    </Figure>
  )
}

export function Figure15NewWindowSemantics() {
  return (
    <Figure
      number="15b"
      title="New window behavior makes bucket labels read trailing ranges"
      subtitle="Each output bucket label now represents the physical range leading into that label, so the right edge of a chart does not require samples from the future."
      width={W}
      height={H}
    >
      <StackDiagram mode="trailing" />
    </Figure>
  )
}
