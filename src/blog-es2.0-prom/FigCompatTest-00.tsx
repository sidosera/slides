import { Figure } from "../share"
import { Node, Arrow, GroupLabel, Annotation } from "../share"
import { C, TINT, FONT_MONO } from "../share"

// FIGURE 07 — Testing compatibility in real workloads.
// Top lane: Prometheus compliance tests → validate PromQL semantics.
// Bottom lane: public dashboards → normalize → fan-out Prometheus vs Elasticsearch → compare.
// Both lanes merge into a compatibility confidence outcome.

const CONTEXT_FILL = "rgba(247,249,252,0.62)"
const CONTEXT_STROKE = "#edf1f6"
const MONO = FONT_MONO

// ── X zones ──────────────────────────────────────────────────────────────────
const NW1 = 162,
  NW2 = 178,
  NW3 = 140,
  NW4 = 164,
  NW5 = 158
const X1 = 32,
  X1R = X1 + NW1 // 194
const X2 = 218,
  X2R = X2 + NW2 // 396
const X3 = 420,
  X3R = X3 + NW3 // 560
const X4 = 584,
  X4R = X4 + NW4 // 748
const X5 = 782,
  X5R = X5 + NW5 // 940

// ── Y centers ────────────────────────────────────────────────────────────────
const YT = 122 // semantic (top) lane
const YF1 = 218 // Prometheus fork arm
const YF2 = 316 // Elasticsearch fork arm
const YB = Math.round((YF1 + YF2) / 2) // 267 — process nodes center
const YO = Math.round((YT + YB) / 2) // 194 — output center

// ── node heights ─────────────────────────────────────────────────────────────
const NH = 40 // standard node
const NHO = 82 // output node (taller for two-line label)

// ── fork / join / merge bar X ─────────────────────────────────────────────────
const FORK_X = X3 - 12 // 408
const JOIN_X = X4 - 12 // 572
const MERGE_X = X5 - 12 // 770

export function Figure07CompatTest() {
  return (
    <Figure
      number="07"
      title="Testing compatibility in real workloads"
      subtitle="Two complementary test suites verify compatibility. Semantic compliance checks PromQL correctness against the Prometheus test suite. Differential testing runs the same expressions against both engines and compares timestamps, labels, and values."
      width={960}
      height={432}
    >
      {/* ── real-world lane context box ────────────────────────────────── */}
      <rect
        x={22}
        y={196}
        width={X4R - 22}
        height={148}
        rx={8}
        fill={CONTEXT_FILL}
        stroke={CONTEXT_STROKE}
        strokeWidth={0.85}
      />

      {/* ── lane labels ──────────────────────────────────────────────────── */}
      <GroupLabel x={X1} y={104} color={C.blue}>
        SEMANTIC COMPLIANCE
      </GroupLabel>
      <GroupLabel x={X1} y={208} color={C.teal}>
        REAL-WORLD DIFFERENTIAL
      </GroupLabel>

      {/* ════════════════════════ SEMANTIC LANE ════════════════ */}

      {/* n1 — Prometheus compliance tests */}
      <Node
        x={X1}
        y={YT - NH / 2}
        w={NW1}
        h={NH}
        label="compliance tests"
        variant="neutral"
        mono
      />

      <Arrow x1={X1R} y1={YT} x2={X2} y2={YT} variant="muted" />

      {/* n2 — Validate PromQL semantics */}
      <Node
        x={X2}
        y={YT - NH / 2}
        w={NW2}
        h={NH}
        label="validate semantics"
        variant="neutral"
        mono
      />

      {/* long dashed wire: n2 → merge bar */}
      <line
        x1={X2R}
        y1={YT}
        x2={MERGE_X}
        y2={YT}
        stroke={C.darkGray}
        strokeWidth={1.1}
        strokeDasharray="4 3"
        strokeLinecap="round"
      />

      {/* ════════════════════════ REAL-WORLD LANE ════════════════ */}

      {/* n3 — Public dashboards & query assets */}
      <Node
        x={X1}
        y={YB - NH / 2}
        w={NW1}
        h={NH}
        label="public dashboards"
        sub="and query assets"
        variant="neutral"
        mono
      />

      <Arrow x1={X1R} y1={YB} x2={X2} y2={YB} variant="muted" />

      {/* n4 — Normalize PromQL */}
      <Node
        x={X2}
        y={YB - NH / 2}
        w={NW2}
        h={NH}
        label="normalize PromQL"
        variant="neutral"
        mono
      />

      {/* n4 → fork bar */}
      <line
        x1={X2R}
        y1={YB}
        x2={FORK_X}
        y2={YB}
        stroke={C.teal}
        strokeWidth={1.9}
        strokeLinecap="round"
      />

      {/* ── fan-out: fork bar → Prometheus and Elasticsearch ── */}
      <line
        x1={FORK_X}
        y1={YF1}
        x2={FORK_X}
        y2={YF2}
        stroke={C.teal}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={FORK_X}
        y1={YF1}
        x2={X3 - 2}
        y2={YF1}
        stroke={C.teal}
        strokeWidth={1.9}
        strokeLinecap="round"
        markerEnd="url(#mk-teal)"
      />
      <line
        x1={FORK_X}
        y1={YF2}
        x2={X3 - 2}
        y2={YF2}
        stroke={C.teal}
        strokeWidth={1.9}
        strokeLinecap="round"
        markerEnd="url(#mk-teal)"
      />

      {/* n5a — Prometheus */}
      <Node
        x={X3}
        y={YF1 - NH / 2}
        w={NW3}
        h={NH}
        label="Prometheus"
        variant="neutral"
        mono
      />

      {/* n5b — Elasticsearch */}
      <Node
        x={X3}
        y={YF2 - NH / 2}
        w={NW3}
        h={NH}
        label="Elasticsearch"
        variant="neutral"
        mono
      />

      {/* ── fan-in: Prometheus and Elasticsearch → join bar → n6 ── */}
      <line
        x1={X3R}
        y1={YF1}
        x2={JOIN_X}
        y2={YF1}
        stroke={C.teal}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={X3R}
        y1={YF2}
        x2={JOIN_X}
        y2={YF2}
        stroke={C.teal}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={JOIN_X}
        y1={YF1}
        x2={JOIN_X}
        y2={YF2}
        stroke={C.teal}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <line
        x1={JOIN_X}
        y1={YB}
        x2={X4 - 2}
        y2={YB}
        stroke={C.teal}
        strokeWidth={1.9}
        strokeLinecap="round"
        markerEnd="url(#mk-teal)"
      />

      {/* n6 — Compare results (key operation) */}
      <Node
        x={X4}
        y={YB - NH / 2}
        w={NW4}
        h={NH}
        label="compare results"
        sub="timestamps · labels · values"
        variant="physical"
        mono
      />

      {/* n6 → merge bar */}
      <line
        x1={X4R}
        y1={YB}
        x2={MERGE_X}
        y2={YB}
        stroke={C.darkGray}
        strokeWidth={1.1}
        strokeDasharray="4 3"
        strokeLinecap="round"
      />

      {/* ════════════════════════ MERGE → OUTPUT ════════════════ */}

      {/* vertical merge bar */}
      <line
        x1={MERGE_X}
        y1={YT}
        x2={MERGE_X}
        y2={YB}
        stroke={C.darkGray}
        strokeWidth={1.1}
        strokeLinecap="round"
      />

      {/* merge bar → output */}
      <Arrow x1={MERGE_X} y1={YO} x2={X5} y2={YO} variant="physical" />

      {/* n7 — Compatibility confidence output */}
      <Node
        x={X5}
        y={YO - NHO / 2}
        w={NW5}
        h={NHO}
        label="compatibility"
        sub="confidence"
        variant="physical"
        mono
      />

      {/* ════════════════════════ CALLOUT ════════════════ */}

      {/* 80%+ note */}
      <rect
        x={X3}
        y={354}
        width={X4R - X3}
        height={54}
        rx={6}
        fill="rgba(254,197,20,0.09)"
        stroke={C.yellow}
        strokeWidth={0.8}
      />
      <text
        x={X3 + 14}
        y={372}
        fontFamily={MONO}
        fontSize={11}
        fontWeight={700}
        fill={C.ink}
        dominantBaseline="central"
      >
        80%+
        <tspan fontWeight={500} fontSize={10} fill={C.mutedInk} dx={6}>
          execute without modification
        </tspan>
      </text>
      <text
        x={X3 + 14}
        y={392}
        fontFamily={MONO}
        fontSize={9}
        fill={C.faintInk}
        dominantBaseline="central"
      >
        Corpus coverage, not universal PromQL compatibility
      </text>
    </Figure>
  )
}
