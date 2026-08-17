import { Figure } from "../diagram/Figure";
import { C, TINT, FONT_MONO } from "../diagram/palette";

// FIGURE 12b — Step-by-step explanation of the label-packing optimisation.

const W = 960;
const STEP_W = 208;
const STEP_H = 130;
const GAP = 14;
const TOP = 56;

const STEPS = [
  {
    num: "①",
    color: C.darkBlue,
    fill: TINT.physical,
    stroke: C.elasticBlue,
    headline: "Data node reads",
    body: "Each data node executes TS → partial stats → read label dims. Raw label column vectors are produced — one per label dimension.",
  },
  {
    num: "②",
    color: C.darkTeal,
    fill: TINT.semantic,
    stroke: C.teal,
    headline: "Pack on the data node",
    body: "pack label dims encodes each label column into a compact BytesRefHash inner key. The step value stays as an outer LongHash key and is never packed.",
  },
  {
    num: "③",
    color: C.darkBlue,
    fill: TINT.physical,
    stroke: C.elasticBlue,
    headline: "One payload crosses the wire",
    body: "Instead of N separate label vectors, a single hierarchical partial state travels over the network: step → { packed label key + partial state }.",
  },
  {
    num: "④",
    color: C.darkTeal,
    fill: TINT.semantic,
    stroke: C.teal,
    headline: "Coordinator only merges",
    body: "The coordinator calls merge hierarchical states — no key construction, no flat key blow-up. Step bytes never enter the inner key, so inner maps stay size M not K×M.",
  },
];

const ARROWS_Y = TOP + STEP_H / 2;
const totalW = STEPS.length * STEP_W + (STEPS.length - 1) * GAP;
const startX = (W - totalW) / 2;

const INSIGHT_Y = TOP + STEP_H + 48;

export function Figure12bPackExplain() {
  return (
    <Figure
      number="12b"
      title="Walk-through: moving packing to the data node"
      subtitle="Four steps show why pushing pack label dims from the coordinator down to each data node compresses network traffic and cuts coordinator memory."
      width={W}
      height={340}
    >
      {/* Step boxes */}
      {STEPS.map((s, i) => {
        const x = startX + i * (STEP_W + GAP);
        return (
          <g key={i}>
            <rect x={x} y={TOP} width={STEP_W} height={STEP_H} rx={10}
              fill={s.fill} stroke={s.stroke} strokeWidth={1.5} />

            {/* step number badge */}
            <circle cx={x + 22} cy={TOP + 22} r={14}
              fill={s.stroke} />
            <text x={x + 22} y={TOP + 22}
              textAnchor="middle" dominantBaseline="central"
              fontSize={13} fontWeight={700} fill={C.white}>
              {s.num}
            </text>

            {/* headline */}
            <text x={x + 42} y={TOP + 22}
              dominantBaseline="central"
              fontSize={12} fontWeight={700} fill={s.color}>
              {s.headline}
            </text>

            {/* body text — wrapped manually */}
            {s.body.split(". ").filter(Boolean).map((line, li) => (
              <foreignObject key={li} x={x + 10} y={TOP + 44 + li * 0} width={STEP_W - 20} height={STEP_H - 48}>
                <div xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    fontSize: 11,
                    lineHeight: 1.5,
                    color: C.ink,
                    fontFamily: "'Inter', sans-serif",
                    padding: "0 2px",
                  }}>
                  {s.body}
                </div>
              </foreignObject>
            ))[0]}

            {/* connector arrow (not after last) */}
            {i < STEPS.length - 1 && (
              <>
                <line
                  x1={x + STEP_W + 2} y1={ARROWS_Y}
                  x2={x + STEP_W + GAP - 2} y2={ARROWS_Y}
                  stroke={C.elasticBlue} strokeWidth={1.5}
                  markerEnd="url(#mk-blue)"
                />
              </>
            )}
          </g>
        );
      })}

      {/* Key insight box */}
      <rect x={startX} y={INSIGHT_Y} width={totalW} height={66} rx={8}
        fill="rgba(11,100,221,0.04)" stroke={C.elasticBlue} strokeWidth={1}
        strokeDasharray="5 3" />
      <text x={startX + totalW / 2} y={INSIGHT_Y + 18}
        textAnchor="middle" dominantBaseline="central"
        fontSize={11} fontWeight={700} fill={C.darkBlue}>
        KEY INSIGHT
      </text>
      <text x={startX + totalW / 2} y={INSIGHT_Y + 38}
        textAnchor="middle" dominantBaseline="central"
        fontSize={11.5} fill={C.ink}>
        Before: N label vectors × K steps cross the exchange — coordinator holds a K×M flat key map.
      </text>
      <text x={startX + totalW / 2} y={INSIGHT_Y + 56}
        textAnchor="middle" dominantBaseline="central"
        fontSize={11.5} fill={C.darkBlue} fontWeight={600}>
        After: 1 hierarchical partial state per step — coordinator holds only M inner-map entries regardless of K.
      </text>

      {/* Before / After byte counts */}
      <text x={startX + 2} y={INSIGHT_Y + 86}
        fontSize={10} fill={C.darkGray} fontFamily={FONT_MONO}>
        BEFORE network payload:  step_vec (8B×N) + cluster_vec + namespace_vec + pod_vec + container_vec + …
      </text>
      <text x={startX + 2} y={INSIGHT_Y + 102}
        fontSize={10} fill={C.darkTeal} fontFamily={FONT_MONO} fontWeight={600}>
        {"AFTER  network payload:  step (8B) → { packed_label_key + partial_state }  — one compact struct"}
      </text>
    </Figure>
  );
}
