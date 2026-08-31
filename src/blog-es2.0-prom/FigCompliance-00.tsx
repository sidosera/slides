import { Figure } from "../share"
import { C, FONT_MONO, TINT } from "../share"

// FIGURE 08 — Real-world dashboards become a continuous compatibility process.
const W = 1040
const softFill = "rgba(247,249,252,0.5)"
const softStroke = "rgba(237,241,246,0.82)"
const panelStroke = "#dfe5ee"
const cardFill = "rgba(255,255,255,0.97)"

function CoverageBackdrop() {
  const line = "M 74 292 C 205 282, 324 264, 450 220 C 560 190, 650 170, 748 148 C 834 128, 902 116, 962 104"
  const area = `${line} L 962 306 L 74 306 Z`

  return (
    <g aria-hidden="true">
      <path d={area} fill={C.teal} opacity={0.036} />
      <path d={line} fill="none" stroke={C.teal} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" opacity={0.2} />
      <circle cx={962} cy={104} r={3} fill={C.teal} opacity={0.28} />
    </g>
  )
}

function PhaseLabel({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={11.6} fontWeight={740} letterSpacing={0.5} fill={C.mutedInk}>
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : 14}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

function MiniDashboard({ x, y, accent, scale = 1 }: { x: number; y: number; accent: string; scale?: number }) {
  const w = 58 * scale
  const h = 38 * scale

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={cardFill} stroke={panelStroke} strokeWidth={0.7} />
      <rect x={x + 6 * scale} y={y + 7 * scale} width={18 * scale} height={10 * scale} fill={accent} opacity={0.12} />
      <rect x={x + 30 * scale} y={y + 7 * scale} width={20 * scale} height={10 * scale} fill={C.lightGray} opacity={0.9} />
      <polyline
        points={`${x + 7 * scale},${y + 30 * scale} ${x + 16 * scale},${y + 24 * scale} ${x + 25 * scale},${y + 28 * scale} ${x + 35 * scale},${y + 20 * scale} ${x + 51 * scale},${y + 23 * scale}`}
        fill="none"
        stroke={accent}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.74}
      />
    </g>
  )
}

function InternetDashboards({ x, y }: { x: number; y: number }) {
  const cx = x + 82
  const cy = y + 78

  return (
    <g>
      <circle cx={cx} cy={cy} r={74} fill="white" opacity={0.28} stroke={softStroke} strokeWidth={0.8} />
      <ellipse cx={cx} cy={cy} rx={72} ry={26} fill="none" stroke={panelStroke} strokeWidth={0.7} opacity={0.32} />
      <ellipse cx={cx} cy={cy} rx={32} ry={72} fill="none" stroke={panelStroke} strokeWidth={0.7} opacity={0.26} />
      <MiniDashboard x={x - 2} y={y + 48} accent={C.teal} scale={1.12} />
      <MiniDashboard x={x + 54} y={y + 23} accent={C.pink} scale={1.18} />
      <MiniDashboard x={x + 92} y={y + 98} accent={C.blue} scale={1.02} />
    </g>
  )
}

function QueryStack({ x, y }: { x: number; y: number }) {
  const queries = [
    { color: C.teal, bars: [54, 30, 76] },
    { color: C.blue, bars: [44, 86, 38] },
    { color: C.pink, bars: [72, 48, 60] },
    { color: C.poppy, bars: [58, 78, 34] },
  ]

  return (
    <g>
      <rect x={x + 4} y={y} width={228} height={148} fill="rgba(255,255,255,0.64)" stroke="rgba(223,229,238,0.54)" strokeWidth={0.7} />
      {queries.map((query, i) => (
        <g key={query.color}>
          <rect x={x + 10} y={y + 28 + i * 22} width={214} height={17.5} fill={i === 1 ? "rgba(11,100,221,0.04)" : "rgba(255,255,255,0.24)"} stroke={i === 1 ? "rgba(11,100,221,0.24)" : "transparent"} strokeWidth={0.5} />
          <circle cx={x + 24} cy={y + 36.8 + i * 22} r={3} fill={query.color} opacity={0.58} />
          {query.bars.map((bar, j) => (
            <rect key={`${query.color}-${j}`} x={x + 46 + j * 56} y={y + 33 + i * 22} width={bar} height={6} fill={C.mutedInk} opacity={j === 0 ? 0.58 : 0.32} />
          ))}
        </g>
      ))}
      <g opacity={0.42}>
        <circle cx={x + 20} cy={y + 127} r={1.8} fill={C.faintInk} />
        <circle cx={x + 28} cy={y + 127} r={1.8} fill={C.faintInk} />
        <circle cx={x + 36} cy={y + 127} r={1.8} fill={C.faintInk} />
        <rect x={x + 52} y={y + 124} width={112} height={5.5} fill={C.faintInk} />
      </g>
    </g>
  )
}

function DiffHarness({ x, y }: { x: number; y: number }) {
  const lines = [
    { prefix: "-", bars: [70, 42, 52], fill: "rgba(8,154,150,0.07)", color: C.darkTeal },
    { prefix: "+", bars: [70, 42, 52], fill: "rgba(11,100,221,0.052)", color: C.darkBlue },
    { prefix: "=", bars: [86, 48], fill: "rgba(245,247,250,0.72)", color: C.mutedInk },
  ]

  return (
    <g>
      <rect x={x + 4} y={y + 26} width={230} height={104} fill="rgba(255,255,255,0.68)" stroke="rgba(223,229,238,0.58)" strokeWidth={0.7} />
      {lines.map((line, i) => (
        <g key={line.prefix}>
          <rect x={x + 11} y={y + 40 + i * 25} width={216} height={19} fill={line.fill} />
          <text x={x + 27} y={y + 49.5 + i * 25} textAnchor="middle" dominantBaseline="central" fontFamily={FONT_MONO} fontSize={10.4} fontWeight={640} fill={line.prefix === "-" ? C.darkTeal : line.prefix === "+" ? C.darkBlue : C.mutedInk}>
            {line.prefix}
          </text>
          {line.bars.map((bar, j) => (
            <rect key={`${line.prefix}-${j}`} x={x + 48 + j * 62} y={y + 46.5 + i * 25} width={bar} height={6} fill={line.color} opacity={j === 0 ? 0.7 : 0.42} />
          ))}
        </g>
      ))}
    </g>
  )
}

function GateStack({ x, y }: { x: number; y: number }) {
  const rows = [62, 86, 74]

  return (
    <g>
      {rows.map((row, i) => (
        <g key={i}>
          <circle cx={x + 24} cy={y + 42 + i * 42} r={7.2} fill={TINT.semantic} stroke={C.teal} />
          <text x={x + 24} y={y + 42 + i * 42} textAnchor="middle" dominantBaseline="central" fontSize={8.4} fontWeight={760} fill={C.darkTeal}>
            ✓
          </text>
          <rect x={x + 46} y={y + 38.5 + i * 42} width={row} height={7} fill={C.ink} opacity={0.62} />
        </g>
      ))}
    </g>
  )
}

export function Figure08Methodology() {
  return (
    <Figure
      number="08"
      showNumber={false}
      title="Real-world PromQL becomes a continuous compatibility process"
      subtitle="Public dashboards feed a query dataset. Every change runs differential tests against Prometheus and Elasticsearch, then the same corpus gates pull requests, nightly builds, and releases."
      width={W}
      height={460}
    >
      <defs>
        <filter id="fig08-card-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={C.devBlue} floodOpacity="0.035" />
        </filter>
      </defs>
      <CoverageBackdrop />
      <rect x={48} y={88} width={944} height={242} fill={softFill} stroke={softStroke} strokeWidth={0.75} />

      <g opacity={0.86} transform="translate(48 94) scale(1.13) translate(-62 -100)">
        <InternetDashboards x={62} y={100} />
      </g>

      <g opacity={0.86}>
        <QueryStack x={276} y={112} />
      </g>

      <g opacity={0.86}>
        <DiffHarness x={592} y={112} />
      </g>

      <g opacity={0.86}>
        <GateStack x={860} y={112} />
      </g>

      <PhaseLabel x={142} y={306} lines={["OPEN SOURCE", "DASHBOARDS"]} />
      <PhaseLabel x={390} y={306} lines={["+4K PROMQL", "QUERIES"]} />
      <PhaseLabel x={712} y={306} lines={["COMPARE RESULTS", "WITH PROMETHEUS"]} />
      <PhaseLabel x={928} y={306} lines={["CI", "GATES"]} />
    </Figure>
  )
}
