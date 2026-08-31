import { Figure } from "../share"
import { C, FONT_MONO } from "../share"

const MONO = FONT_MONO

const BARS = [
  { label: "Aggregations & grouping",              share: 59.6669 },
  { label: "Selectors",                            share: 57.5548 },
  { label: "Range vectors & rate functions",       share: 45.2071 },
  { label: "Binary expressions & vector matching", share: 30.1787 },
  { label: "Histograms",                           share:  6.3769 },
  { label: "Scalar / vector & utility",            share:  2.8838 },
  { label: "Ranking & sorting",                    share:  0.8123 },
  { label: "Label manipulation",                   share:  0.7311 },
  { label: "Time expressions & modifiers",         share:  0.7311 },
]

function barColor(rank: number, total: number): string {
  const t = rank / (total - 1)
  const r = Math.round(11  + (220 - 11)  * t)
  const g = Math.round(100 + (226 - 100) * t)
  const b = Math.round(221 + (234 - 221) * t)
  return `rgb(${r},${g},${b})`
}

const FIG_W   = 960
const CHART_X = 292   // label area is 0..280; 12px gap to bars
const CHART_W = 596   // bars span 292..888
const MAX_PCT = 65
const SCALE   = CHART_W / MAX_PCT

const TOP_PAD      = 28
const BAR_H        = 30
const ROW_H        = 50
const CHART_BOTTOM = TOP_PAD + (BARS.length - 1) * ROW_H + BAR_H  // 28+400+30=458
const FIG_H        = CHART_BOTTOM + 24  // 482

const SEP = "#edf1f6"

export function Figure01ClassDist() {
  return (
    <Figure
      number="01"
      title="PromQL feature prevalence in the query corpus"
      subtitle="Nine feature classes ranked by the share of unique queries in which each appears (n = 2,462 queries). A single query may belong to multiple classes."
      width={FIG_W}
      height={FIG_H}
    >
      {/* baseline */}
      <line x1={CHART_X} y1={TOP_PAD - 2} x2={CHART_X} y2={CHART_BOTTOM}
        stroke={C.mediumGray} strokeWidth={1} />

      {BARS.map((d, i) => {
        const y    = TOP_PAD + i * ROW_H
        const mid  = y + BAR_H / 2
        const barW = d.share * SCALE

        return (
          <g key={i}>
            {i > 0 && (
              <line x1={CHART_X} y1={y - (ROW_H - BAR_H) / 2}
                    x2={CHART_X + CHART_W} y2={y - (ROW_H - BAR_H) / 2}
                stroke={SEP} strokeWidth={0.4} />
            )}

            {/* category label — Inter (diagram default), matching Node label style */}
            <text x={CHART_X - 12} y={mid}
              textAnchor="end" dominantBaseline="central"
              fontSize={13} fontWeight={600} fill={C.ink}>
              {d.label}
            </text>

            {/* bar */}
            <rect x={CHART_X} y={y} width={barW} height={BAR_H}
              fill={barColor(i, BARS.length)} rx={2} />

            {/* value — MONO, data token */}
            <text x={CHART_X + barW + 10} y={mid}
              dominantBaseline="central"
              fontSize={11} fontWeight={650} fill={C.mutedInk} fontFamily={MONO}>
              {d.share.toFixed(2)}%
            </text>
          </g>
        )
      })}
    </Figure>
  )
}
