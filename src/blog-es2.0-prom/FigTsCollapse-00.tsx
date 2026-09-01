import { Figure } from "../share"
import { Arrow, GroupLabel } from "../share"
import { C, TINT, FONT_MONO } from "../share"

// FIGURE 04 — TimeSeriesCollapse: flat engine columns → per-series Prometheus rows.
// Layout: engine columns at top, operator in middle, Prometheus rows at bottom (like Fig 13b).

const A = C.elasticBlue
const B = C.pink
const GRY = C.darkGray
const KEY = C.darkTeal
const SOFT_STROKE = "#edf1f6"
const MONO = FONT_MONO

const rows = [
  { t: "10:00", v: "42", svc: "nginx-proxy", region: "us-west-1", c: A },
  { t: "10:01", v: "43", svc: "nginx-proxy", region: "us-west-1", c: A },
  { t: "10:02", v: "41", svc: "nginx-proxy", region: "us-west-1", c: A },
  {
    t: "10:00",
    v: "12",
    svc: "vllm-xlarge.service",
    region: "us-east-1",
    c: B,
  },
  {
    t: "10:01",
    v: "14",
    svc: "vllm-xlarge.service",
    region: "us-east-1",
    c: B,
  },
]

const FIG_W = 960
const COL_GAP = 7
const HDR_H = 32
const ROW_H = 30
const COL_H = HDR_H + rows.length * ROW_H // 182

type Row = typeof rows[number]

const colDefs: Array<{
  label: string
  w: number
  size: number
  get: (r: Row) => string
  fill: string
  stroke: string
  text: string
}> = [
  {
    label: "timestamp",
    w: 80,
    size: 10.5,
    get: (r) => r.t,
    fill: TINT.physical,
    stroke: C.blue,
    text: C.darkBlue,
  },
  {
    label: "value",
    w: 52,
    size: 10.5,
    get: (r) => r.v,
    fill: TINT.value,
    stroke: C.pink,
    text: C.pink,
  },
  {
    label: "service",
    w: 175,
    size: 8.8,
    get: (r) => r.svc,
    fill: TINT.semantic,
    stroke: C.teal,
    text: C.darkTeal,
  },
  {
    label: "region",
    w: 98,
    size: 8.5,
    get: (r) => r.region,
    fill: C.lightGray,
    stroke: C.darkGray,
    text: C.mutedInk,
  },
]

// Center the column group horizontally in the figure
const TOTAL_COL_W = colDefs.reduce(
  (s, c, i) => s + c.w + (i < colDefs.length - 1 ? COL_GAP : 0),
  0,
) // 361
const COL_X = Math.round((FIG_W - TOTAL_COL_W) / 2) // 300
const COL_Y = 100
const COL_BOTTOM = COL_Y + COL_H // 282

const colXs = colDefs.reduce<number[]>((acc, _, i) => {
  acc.push(i === 0 ? COL_X : acc[i - 1] + colDefs[i - 1].w + COL_GAP)
  return acc
}, [])
const COLS_RIGHT = colXs[colXs.length - 1] + colDefs[colDefs.length - 1].w // 661
const COLS_MID_X = Math.round((COL_X + COLS_RIGHT) / 2) // 481

function EngineColumns() {
  return (
    <g>
      {colDefs.map((col, ci) => {
        const x = colXs[ci]
        const clipId = `fig04-col${ci}`
        return (
          <g key={col.label}>
            <defs>
              <clipPath id={clipId}>
                <rect x={x} y={COL_Y} width={col.w} height={COL_H} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`}>
              {/* white body — color only in header band, like Fig 13b */}
              <rect
                x={x}
                y={COL_Y}
                width={col.w}
                height={COL_H}
                fill="rgba(255,255,255,0.92)"
              />
              <rect
                x={x}
                y={COL_Y}
                width={col.w}
                height={HDR_H}
                fill={col.fill}
              />
              {rows.map(
                (_, ri) =>
                  ri > 0 && (
                    <line
                      key={ri}
                      x1={x}
                      y1={COL_Y + HDR_H + ri * ROW_H}
                      x2={x + col.w}
                      y2={COL_Y + HDR_H + ri * ROW_H}
                      stroke={SOFT_STROKE}
                      strokeWidth={0.5}
                    />
                  ),
              )}
            </g>
            {/* colored border — same palette as Fig 13 vectorColumns */}
            <rect
              x={x}
              y={COL_Y}
              width={col.w}
              height={COL_H}
              fill="none"
              stroke={col.stroke}
              strokeWidth={0.85}
            />
            <line
              x1={x}
              y1={COL_Y + HDR_H}
              x2={x + col.w}
              y2={COL_Y + HDR_H}
              stroke={SOFT_STROKE}
              strokeWidth={0.7}
            />
            {/* header label — Fig 13b style: larger, col.text color */}
            <text
              x={x + col.w / 2}
              y={COL_Y + HDR_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={9.5}
              fontWeight={650}
              fill={col.text}
              fontFamily={MONO}
            >
              {col.label}
            </text>
            {rows.map((r, ri) => (
              <text
                key={ri}
                x={x + col.w / 2}
                y={COL_Y + HDR_H + ri * ROW_H + ROW_H / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={col.size}
                fill={col.text}
                fontFamily={MONO}
              >
                {col.get(r)}
              </text>
            ))}
          </g>
        )
      })}
    </g>
  )
}

const collapsedRows = [
  {
    timestamp: ["10:00", "10:01", "10:02"],
    value: ["42", "43", "41"],
    service: ["nginx-proxy"],
    region: ["us-west-1"],
  },
  {
    timestamp: ["10:00", "10:01"],
    value: ["12", "14"],
    service: ["vllm-xlarge.service"],
    region: ["us-east-1"],
  },
] as const

type CollapsedRow = typeof collapsedRows[number]

const collapsedDefs: Array<{
  label: string
  w: number
  size: number
  get: (row: CollapsedRow) => readonly string[]
  fill: string
  stroke: string
  text: string
}> = [
  {
    label: "timestamp",
    w: 80,
    size: 7.2,
    get: (r) => r.timestamp,
    fill: TINT.physical,
    stroke: C.blue,
    text: C.darkBlue,
  },
  {
    label: "value",
    w: 52,
    size: 8,
    get: (r) => r.value,
    fill: TINT.value,
    stroke: C.pink,
    text: C.pink,
  },
  {
    label: "service",
    w: 175,
    size: 8.2,
    get: (r) => r.service,
    fill: TINT.semantic,
    stroke: C.teal,
    text: C.darkTeal,
  },
  {
    label: "region",
    w: 98,
    size: 8,
    get: (r) => r.region,
    fill: C.lightGray,
    stroke: C.darkGray,
    text: C.mutedInk,
  },
]

const COLLAPSED_ROW_H = 58
const COLLAPSED_H = HDR_H + collapsedRows.length * COLLAPSED_ROW_H

function CollapsedColumns({ y }: { y: number }) {
  return (
    <g>
      {collapsedDefs.map((col, ci) => {
        const x = colXs[ci]
        return (
          <g key={col.label}>
            <rect
              x={x}
              y={y}
              width={col.w}
              height={COLLAPSED_H}
              fill="rgba(255,255,255,0.92)"
              stroke={col.stroke}
              strokeWidth={0.85}
            />
            <rect x={x} y={y} width={col.w} height={HDR_H} fill={col.fill} />
            <text
              x={x + col.w / 2}
              y={y + HDR_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={9.5}
              fontWeight={650}
              fill={col.text}
              fontFamily={MONO}
            >
              {col.label}
            </text>
            {collapsedRows.map((row, ri) => {
              const values = col.get(row)
              const positionY = y + HDR_H + ri * COLLAPSED_ROW_H + 7
              const positionX = x + 5
              const positionW = col.w - 10
              const gap = 3
              const valueW =
                (positionW - 8 - gap * (values.length - 1)) / values.length
              return (
                <g key={ri}>
                  <rect
                    x={positionX}
                    y={positionY}
                    width={positionW}
                    height={44}
                    fill={C.white}
                    stroke={col.stroke}
                    strokeWidth={0.5}
                  />
                  {values.map((value, vi) => (
                    <g key={vi}>
                      <rect
                        x={positionX + 4 + vi * (valueW + gap)}
                        y={positionY + 6}
                        width={valueW}
                        height={32}
                        fill={col.fill}
                        stroke={col.stroke}
                        strokeWidth={0.35}
                      />
                      {ci >= 2 && (
                        <text
                          x={positionX + 4 + vi * (valueW + gap) + valueW / 2}
                          y={positionY + 22}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={col.size}
                          fill={col.text}
                          fontFamily={MONO}
                        >
                          {value}
                        </text>
                      )}
                    </g>
                  ))}
                </g>
              )
            })}
          </g>
        )
      })}
    </g>
  )
}

const SERIES_W = 58

function SeriesSection({
  x,
  y,
  height,
  label,
}: {
  x: number
  y: number
  height: number
  label: string
}) {
  return (
    <g>
      <text
        x={x + SERIES_W}
        y={y + height / 2}
        textAnchor="end"
        dominantBaseline="central"
        fontSize={7.2}
        fontWeight={700}
        letterSpacing={0.4}
        fill={C.mutedInk}
        fontFamily={MONO}
      >
        {label}
      </text>
    </g>
  )
}

function CountTag({ x, y, label }: { x: number y: number label: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="end"
      dominantBaseline="central"
      fontSize={7.5}
      fontWeight={700}
      letterSpacing={0.4}
      fill={C.faintInk}
      fontFamily={MONO}
    >
      {label}
    </text>
  )
}

export function Figure04Collapse() {
  const pagePadLeft = 75
  const pagePadRight = 20
  const pageHeaderH = 42
  const pageFooterH = 16
  const inputFrameX = COL_X - pagePadLeft
  const inputFrameY = COL_Y - pageHeaderH
  const frameW = TOTAL_COL_W + pagePadLeft + pagePadRight
  const inputFrameH = pageHeaderH + COL_H + pageFooterH
  const inputFrameBottom = inputFrameY + inputFrameH

  const opW = 200
  const opH = 52
  const opY = inputFrameBottom + 42
  const opX = COLS_MID_X - opW / 2

  const outputFrameY = opY + opH + 48
  const outputY = outputFrameY + pageHeaderH
  const outputFrameH = pageHeaderH + COLLAPSED_H + pageFooterH

  const figH = outputFrameY + outputFrameH + 24

  return (
    <Figure
      number="04"
      title="From one position per step to one position per series"
      subtitle="TimeSeriesCollapse removes repeated dimensions and folds timestamp and value into aligned multi-valued Blocks—without leaving the Page representation."
      width={FIG_W}
      height={figH}
    >
      <rect
        x={inputFrameX}
        y={inputFrameY}
        width={frameW}
        height={inputFrameH}
        fill={C.white}
        stroke={SOFT_STROKE}
        strokeWidth={0.9}
      />
      <GroupLabel x={COL_X} y={inputFrameY + 25}>
        INPUT PAGE
      </GroupLabel>
      <CountTag x={COLS_RIGHT} y={inputFrameY + 25} label="5 POSITIONS" />
      <EngineColumns />
      <SeriesSection
        x={inputFrameX + 10}
        y={COL_Y + HDR_H}
        height={ROW_H * 3}
        label="SERIES A"
      />
      <SeriesSection
        x={inputFrameX + 10}
        y={COL_Y + HDR_H + ROW_H * 3}
        height={ROW_H * 2}
        label="SERIES B"
      />

      <Arrow
        x1={COLS_MID_X}
        y1={inputFrameBottom}
        x2={COLS_MID_X}
        y2={opY - 8}
        variant="muted"
      />

      <rect
        x={opX}
        y={opY}
        width={opW}
        height={opH}
        fill="rgba(8,154,150,0.07)"
        stroke={C.teal}
        strokeWidth={1.15}
      />
      <text
        x={COLS_MID_X}
        y={opY + opH / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12.5}
        fontWeight={700}
        fill={C.darkTeal}
        fontFamily={MONO}
      >
        TimeSeriesCollapse
      </text>

      <Arrow
        x1={COLS_MID_X}
        y1={opY + opH}
        x2={COLS_MID_X}
        y2={outputFrameY - 8}
        variant="semantic"
      />

      <rect
        x={inputFrameX}
        y={outputFrameY}
        width={frameW}
        height={outputFrameH}
        fill={C.white}
        stroke={SOFT_STROKE}
        strokeWidth={0.9}
      />
      <GroupLabel x={COL_X} y={outputFrameY + 25}>
        OUTPUT PAGE
      </GroupLabel>
      <CountTag x={COLS_RIGHT} y={outputFrameY + 25} label="2 POSITIONS" />
      <CollapsedColumns y={outputY} />
      <SeriesSection
        x={inputFrameX + 10}
        y={outputY + HDR_H}
        height={COLLAPSED_ROW_H}
        label="SERIES A"
      />
      <SeriesSection
        x={inputFrameX + 10}
        y={outputY + HDR_H + COLLAPSED_ROW_H}
        height={COLLAPSED_ROW_H}
        label="SERIES B"
      />
    </Figure>
  )
}
