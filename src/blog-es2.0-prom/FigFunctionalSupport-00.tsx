import { Figure } from "../share"
import { C, FONT_MONO } from "../share"

const W = 1040
const H = 380
const MONO = FONT_MONO

const PLOT = { x: 86, y: 48, w: 850, h: 266 }
const Y_MAX = 100

const DAY_MAX = 176
const WEEK_START = 11
const WEEK_COUNT = 26
const TECH_PREVIEW_DAY = 49
const GA_DAY = 112
const WEEK_TICKS = Array.from({ length: WEEK_COUNT }, (_, i) => ({
  day: i * 7,
  label: `W${WEEK_START + i}`,
}))

function xForDay(day: number) {
  return PLOT.x + (day / DAY_MAX) * PLOT.w
}

function yFor(value: number) {
  return PLOT.y + PLOT.h - (value / Y_MAX) * PLOT.h
}

function p(day: number, value: number) {
  return `${xForDay(day).toFixed(1)} ${yFor(value).toFixed(1)}`
}

function activeTrendPath() {
  return [
    `M ${p(0, 0)}`,
    `C ${p(5, 0)} ${p(8, 0)} ${p(12, 5)}`,
    `C ${p(16, 10)} ${p(18, 20)} ${p(21, 26)}`,
    `C ${p(27, 26)} ${p(31, 26)} ${p(35, 26)}`,
    `C ${p(40, 34)} ${p(43, 48)} ${p(49, 56)}`,
    `C ${p(57, 57)} ${p(67, 57)} ${p(77, 57)}`,
    `C ${p(90, 63)} ${p(102, 72)} ${p(GA_DAY, 80)}`,
  ].join(" ")
}

function futureTrendPath() {
  return [
    `M ${p(GA_DAY, 80)}`,
    `C ${p(130, 82)} ${p(154, 86)} ${p(175, 90)}`,
  ].join(" ")
}

function areaPath() {
  return `${activeTrendPath()} L ${xForDay(GA_DAY).toFixed(1)} ${PLOT.y + PLOT.h} L ${xForDay(0).toFixed(1)} ${PLOT.y + PLOT.h} Z`
}

function Grid() {
  const ticks = [0, 20, 40, 60, 80, 100]

  return (
    <g>
      {WEEK_TICKS.slice(1).map((week) => (
        <line
          key={week.label}
          x1={xForDay(week.day)}
          y1={PLOT.y}
          x2={xForDay(week.day)}
          y2={PLOT.y + PLOT.h}
          stroke="#edf1f6"
          strokeWidth={(week.day / 7) % 4 === 0 ? 0.7 : 0.5}
          opacity={(week.day / 7) % 4 === 0 ? 0.58 : 0.32}
        />
      ))}
      {ticks.map((tick) => {
        const y = yFor(tick)

        return (
          <g key={tick}>
            <line
              x1={PLOT.x}
              y1={y}
              x2={PLOT.x + PLOT.w}
              y2={y}
              stroke={tick === 0 ? C.mediumGray : "#edf1f6"}
              strokeWidth={tick === 0 ? 0.9 : 0.7}
            />
            <text
              x={PLOT.x - 16}
              y={y}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily={MONO}
              fontSize={10}
              fontWeight={560}
              fill={C.mutedInk}
            >
              {tick}%
            </text>
          </g>
        )
      })}
      <line
        x1={PLOT.x}
        y1={PLOT.y}
        x2={PLOT.x}
        y2={PLOT.y + PLOT.h}
        stroke={C.mediumGray}
        strokeWidth={0.9}
      />
    </g>
  )
}

function AxisLabels() {
  return (
    <g>
      {WEEK_TICKS.map((week) => (
        <g key={week.label}>
          <line
            x1={xForDay(week.day)}
            y1={PLOT.y + PLOT.h}
            x2={xForDay(week.day)}
            y2={PLOT.y + PLOT.h + 8}
            stroke={C.mediumGray}
            strokeWidth={0.55}
            opacity={week.day > GA_DAY ? 0.34 : 0.52}
          />
          <text
            x={xForDay(week.day)}
            y={PLOT.y + PLOT.h + 26}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={8.4}
            fontWeight={560}
            fill={week.day > GA_DAY ? C.faintInk : C.mutedInk}
          >
            {week.label}
          </text>
        </g>
      ))}
    </g>
  )
}

function EventMarkers() {
  const techX = xForDay(TECH_PREVIEW_DAY)
  const gaX = xForDay(GA_DAY)
  const events = [
    { label: "TECH PREVIEW", x: techX },
    { label: "GA", x: gaX },
  ]

  return (
    <g>
      {events.map((event) => (
        <g key={event.label}>
          <line
            x1={event.x}
            y1={PLOT.y - 24}
            x2={event.x}
            y2={PLOT.y + PLOT.h}
            stroke={C.pink}
            strokeWidth={1.35}
            strokeDasharray="5 7"
            opacity={0.78}
          />
          <text
            x={event.x}
            y={PLOT.y - 32}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={10.6}
            fontWeight={780}
            fill={C.pink}
          >
            {event.label}
          </text>
        </g>
      ))}
    </g>
  )
}

function SupportChart() {
  return (
    <g>
      <rect
        x={PLOT.x}
        y={PLOT.y}
        width={PLOT.w}
        height={PLOT.h}
        rx={8}
        fill="rgba(255,255,255,0.78)"
        stroke="#edf1f6"
        strokeWidth={0.8}
      />
      <g clipPath="url(#fig08b-plot-clip)">
        <rect
          x={xForDay(GA_DAY)}
          y={PLOT.y}
          width={PLOT.x + PLOT.w - xForDay(GA_DAY)}
          height={PLOT.h}
          fill="rgba(245,247,250,0.9)"
        />
        <path d={areaPath()} fill="url(#fig08b-area-gradient)" />
      </g>
      <Grid />
      <g clipPath="url(#fig08b-plot-clip)">
        <path
          d={activeTrendPath()}
          fill="none"
          stroke={C.blue}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={futureTrendPath()}
          fill="none"
          stroke={C.darkGray}
          strokeWidth={2.1}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.54}
        />
      </g>
      <EventMarkers />
      <AxisLabels />
    </g>
  )
}

export function Figure08bFunctionalSupport() {
  return (
    <Figure
      number="08b"
      title="Functional PromQL support reached 80% for GA"
      subtitle="By the beginning of July, the compatibility corpus showed 80% functional support across the public-dashboard workload. Later gains are shown as post-GA progress, but the GA result remains the reporting focus."
      width={W}
      height={H}
    >
      <defs>
        <clipPath id="fig08b-plot-clip">
          <rect x={PLOT.x} y={PLOT.y} width={PLOT.w} height={PLOT.h} rx={8} />
        </clipPath>
        <linearGradient
          id="fig08b-area-gradient"
          x1="0"
          x2="0"
          y1={PLOT.y}
          y2={PLOT.y + PLOT.h}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={C.blue} stopOpacity="0.06" />
          <stop offset="100%" stopColor={C.blue} stopOpacity="0.18" />
        </linearGradient>
        <filter
          id="fig08b-card-shadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="150%"
        >
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor={C.devBlue}
            floodOpacity="0.045"
          />
        </filter>
      </defs>

      <SupportChart />
    </Figure>
  )
}
