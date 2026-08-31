import { Figure } from "../share"
import { Arrow, GroupLabel } from "../share"
import { C, TINT, FONT_MONO } from "../share"

// FIGURE 04 — TimeSeriesCollapse: flat engine columns → per-series Prometheus rows.
// Layout: engine columns at top, operator in middle, Prometheus rows at bottom (like Fig 13b).

const A   = C.elasticBlue
const B   = C.pink
const GRY = C.darkGray
const KEY = C.darkTeal
const SOFT_STROKE = "#edf1f6"
const MONO = FONT_MONO

const rows = [
  { t: "10:00", v: "42", svc: "nginx-proxy",         region: "us-west-1", c: A },
  { t: "10:01", v: "43", svc: "nginx-proxy",         region: "us-west-1", c: A },
  { t: "10:02", v: "41", svc: "nginx-proxy",         region: "us-west-1", c: A },
  { t: "10:00", v: "12", svc: "vllm-xlarge.service", region: "us-east-1", c: B },
  { t: "10:01", v: "14", svc: "vllm-xlarge.service", region: "us-east-1", c: B },
]

const FIG_W    = 960
const COL_GAP  = 7
const HDR_H    = 32
const ROW_H    = 30
const COL_H    = HDR_H + rows.length * ROW_H  // 182

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
  { label: "timestamp", w: 80,  size: 10.5, get: (r) => r.t,      fill: TINT.physical, stroke: C.blue,     text: C.darkBlue  },
  { label: "value",     w: 52,  size: 10.5, get: (r) => r.v,      fill: TINT.value,    stroke: C.pink,     text: C.pink      },
  { label: "service",   w: 175, size: 8.8,  get: (r) => r.svc,    fill: TINT.semantic, stroke: C.teal,     text: C.darkTeal  },
  { label: "region",    w: 98,  size: 8.5,  get: (r) => r.region, fill: C.lightGray,   stroke: C.darkGray, text: C.mutedInk  },
]

// Center the column group horizontally in the figure
const TOTAL_COL_W = colDefs.reduce((s, c, i) => s + c.w + (i < colDefs.length - 1 ? COL_GAP : 0), 0)  // 361
const COL_X       = Math.round((FIG_W - TOTAL_COL_W) / 2)  // 300
const COL_Y       = 100
const COL_BOTTOM  = COL_Y + COL_H  // 282

const colXs = colDefs.reduce<number[]>((acc, _, i) => {
  acc.push(i === 0 ? COL_X : acc[i - 1] + colDefs[i - 1].w + COL_GAP)
  return acc
}, [])
const COLS_RIGHT = colXs[colXs.length - 1] + colDefs[colDefs.length - 1].w  // 661
const COLS_MID_X = Math.round((COL_X + COLS_RIGHT) / 2)  // 481

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
              <rect x={x} y={COL_Y} width={col.w} height={COL_H} fill="rgba(255,255,255,0.92)" />
              <rect x={x} y={COL_Y} width={col.w} height={HDR_H} fill={col.fill} />
              {rows.map((_, ri) => ri > 0 && (
                <line key={ri}
                  x1={x} y1={COL_Y + HDR_H + ri * ROW_H}
                  x2={x + col.w} y2={COL_Y + HDR_H + ri * ROW_H}
                  stroke={SOFT_STROKE} strokeWidth={0.5}
                />
              ))}
            </g>
            {/* colored border — same palette as Fig 13 vectorColumns */}
            <rect x={x} y={COL_Y} width={col.w} height={COL_H} fill="none" stroke={col.stroke} strokeWidth={0.85} />
            <line x1={x} y1={COL_Y + HDR_H} x2={x + col.w} y2={COL_Y + HDR_H} stroke={SOFT_STROKE} strokeWidth={0.7} />
            {/* header label — Fig 13b style: larger, col.text color */}
            <text x={x + col.w / 2} y={COL_Y + HDR_H / 2}
              textAnchor="middle" dominantBaseline="central"
              fontSize={9.5} fontWeight={650} fill={col.text} fontFamily={MONO}>
              {col.label}
            </text>
            {rows.map((r, ri) => (
              <text key={ri}
                x={x + col.w / 2} y={COL_Y + HDR_H + ri * ROW_H + ROW_H / 2}
                textAnchor="middle" dominantBaseline="central"
                fontSize={col.size} fill={col.text} fontFamily={MONO}>
                {col.get(r)}
              </text>
            ))}
          </g>
        )
      })}
    </g>
  )
}

type Part = { t: string; c: string }

function PrometheusRows({ x, y, w }: { x: number; y: number; w: number }) {
  const rowH    = 56
  const rowGap  = 10
  const padV    = 12
  const lineH   = 16
  const lineGap = 4
  const fs      = 9
  const lx      = x + 16

  const series: Array<{ accent: string; l1: Part[]; l2: Part[] }> = [
    {
      accent: A,
      l1: [
        { t: '{', c: GRY }, { t: 'metric', c: KEY }, { t: ':{', c: GRY },
        { t: 'service', c: KEY }, { t: ':', c: GRY }, { t: '"nginx-proxy"', c: A },
        { t: ', ', c: GRY }, { t: 'region', c: KEY }, { t: ':', c: GRY },
        { t: '"us-west-1"', c: A }, { t: '},', c: GRY },
      ],
      l2: [
        { t: ' values', c: KEY }, { t: ':[[', c: GRY },
        { t: '10:00', c: A }, { t: ',"', c: GRY }, { t: '42', c: C.ink }, { t: '"],[', c: GRY },
        { t: '10:01', c: A }, { t: ',"', c: GRY }, { t: '43', c: C.ink }, { t: '"],[', c: GRY },
        { t: '10:02', c: A }, { t: ',"', c: GRY }, { t: '41', c: C.ink }, { t: '"]]', c: GRY },
        { t: '}', c: GRY },
      ],
    },
    {
      accent: B,
      l1: [
        { t: '{', c: GRY }, { t: 'metric', c: KEY }, { t: ':{', c: GRY },
        { t: 'service', c: KEY }, { t: ':', c: GRY }, { t: '"vllm-xlarge.service"', c: B },
        { t: ', ', c: GRY }, { t: 'region', c: KEY }, { t: ':', c: GRY },
        { t: '"us-east-1"', c: B }, { t: '},', c: GRY },
      ],
      l2: [
        { t: ' values', c: KEY }, { t: ':[[', c: GRY },
        { t: '10:00', c: B }, { t: ',"', c: GRY }, { t: '12', c: C.ink }, { t: '"],[', c: GRY },
        { t: '10:01', c: B }, { t: ',"', c: GRY }, { t: '14', c: C.ink }, { t: '"]]', c: GRY },
        { t: '}', c: GRY },
      ],
    },
  ]

  return (
    <g>
      {series.map((s, i) => {
        const ry  = y + i * (rowH + rowGap)
        const l1y = ry + padV + lineH / 2
        const l2y = ry + padV + lineH + lineGap + lineH / 2
        return (
          <g key={i}>
            <rect x={x} y={ry} width={w} height={rowH}
              fill="rgba(255,255,255,0.92)" stroke={SOFT_STROKE} strokeWidth={0.85} />
            <rect x={x} y={ry} width={3} height={rowH} fill={s.accent} opacity={0.5} />
            <text x={lx} y={l1y} dominantBaseline="central" fontSize={fs} fontFamily={MONO}>
              {s.l1.map((p, pi) => <tspan key={pi} fill={p.c}>{p.t}</tspan>)}
            </text>
            <text x={lx} y={l2y} dominantBaseline="central" fontSize={fs} fontFamily={MONO}>
              {s.l2.map((p, pi) => <tspan key={pi} fill={p.c}>{p.t}</tspan>)}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export function Figure04Collapse() {
  const opW    = 220
  const opH    = 60
  const opY    = COL_BOTTOM + 60
  const opX    = COLS_MID_X - opW / 2

  const panelW = TOTAL_COL_W   // aligns with engine columns
  const panelH = 52 * 2 + 10  // 114
  const panelX = COL_X
  const panelY = opY + opH + 52

  const figH   = panelY + panelH + 36

  return (
    <Figure
      number="04"
      title="One series, many execution rows"
      subtitle="query_range exposed a missing execution primitive. TimeSeriesCollapse folds flat engine rows back onto the requested per-series evaluation grid."
      width={FIG_W}
      height={figH}
    >
      <GroupLabel x={COL_X} y={COL_Y - 18}>ENGINE</GroupLabel>
      <EngineColumns />

      <Arrow x1={COLS_MID_X} y1={COL_BOTTOM} x2={COLS_MID_X} y2={opY} variant="physical" />

      <rect x={opX} y={opY} width={opW} height={opH}
        fill={TINT.physical} stroke={C.blue} strokeWidth={1.8} />
      <text
        x={COLS_MID_X} y={opY + opH / 2}
        textAnchor="middle" dominantBaseline="central"
        fontSize={13.5} fontWeight={700} fill={C.darkBlue} fontFamily={MONO}
      >
        TimeSeriesCollapse
      </text>

      <Arrow x1={COLS_MID_X} y1={opY + opH} x2={COLS_MID_X} y2={panelY} variant="physical" />

      <GroupLabel x={panelX} y={panelY - 18}>PROMETHEUS ROWS</GroupLabel>
      <PrometheusRows x={panelX} y={panelY} w={panelW} />
    </Figure>
  )
}
