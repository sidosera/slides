import { Figure } from "../diagram/Figure";
import { Node, Arrow, ExchangeBoundary, Annotation, GroupLabel, Label, Edge } from "../diagram/grammar";
import { C, TINT } from "../diagram/palette";

// FIGURE 12 — Pack label dimensions before the exchange.
// BEFORE: raw label column vectors (including step) all cross the network;
//         coordinator assembles the flat composite key (step + labels) and
//         does the final aggregation.
// AFTER:  data node packs label dims into the inner BytesRefHash key (step
//         is kept as the outer LongHash key — not packed); one compact
//         hierarchical partial state crosses the wire; coordinator only merges.

const NW = 180;

function Col({
  cx,
  title,
  upper,
  packIndex,
  netY,
  crossing,
  lower,
}: {
  cx: number;
  title: string;
  upper: string[];
  packIndex: number;
  netY: number;
  crossing: { thick: boolean; labels: string[] };
  lower: string[];
}) {
  const x = cx - NW / 2;
  const h = 30;
  const step = 42;
  const top = 84;

  // y of first lower node
  const firstLowerY = netY + 24 + crossing.labels.length * 18 + 26;
  // bottom of crossing-label zone (midpoint for incoming arrow)
  const crossingMidY = netY + 14 + (crossing.labels.length * 18) / 2;

  return (
    <g>
      <Label x={cx} y={56} color={C.darkInk} size={13} weight={700}>
        {title}
      </Label>

      {/* DATA NODE */}
      <GroupLabel x={x} y={top - 12} color={C.darkGray}>DATA NODE</GroupLabel>
      {upper.map((l, i) => {
        const y = top + i * step;
        const variant = i === packIndex ? "physical" : "neutral";
        return (
          <g key={l}>
            <Node x={x} y={y} w={NW} h={h} label={l} variant={variant} />
            {i < upper.length - 1 && (
              <Arrow x1={cx} y1={y + h} x2={cx} y2={y + step} variant="logical" />
            )}
          </g>
        );
      })}

      {/* arrow / edges from last data-node op down to network boundary */}
      {crossing.thick ? (
        <Arrow
          x1={cx}
          y1={top + (upper.length - 1) * step + h}
          x2={cx}
          y2={netY - 4}
          variant="physical"
        />
      ) : (
        [0, 1, 2, 3].map((i) => (
          <Edge
            key={i}
            x1={cx - 42 + i * 28}
            y1={top + (upper.length - 1) * step + h}
            x2={cx - 42 + i * 28}
            y2={netY - 4}
            color={C.elasticBlue}
            width={1}
            dashed
          />
        ))
      )}

      <ExchangeBoundary x1={cx - 120} x2={cx + 120} y={netY} label="NETWORK" />

      {/* crossing payload labels */}
      {crossing.labels.map((l, i) => (
        <Label
          key={l}
          x={cx}
          y={netY + 24 + i * 18}
          color={crossing.thick ? C.darkBlue : C.ink}
          size={11}
          mono
        >
          {l}
        </Label>
      ))}

      {/* arrow from network into coordinator's first node */}
      {crossing.thick ? (
        <Arrow
          x1={cx}
          y1={netY + 14 + crossing.labels.length * 18}
          x2={cx}
          y2={firstLowerY}
          variant="physical"
        />
      ) : (
        <Arrow
          x1={cx}
          y1={netY + 14 + crossing.labels.length * 18}
          x2={cx}
          y2={firstLowerY}
          variant="muted"
        />
      )}

      {/* COORDINATOR */}
      <GroupLabel x={x} y={firstLowerY - 14} color={C.darkGray}>COORDINATOR</GroupLabel>
      {lower.map((l, i) => {
        const y = firstLowerY + i * step;
        return (
          <g key={l}>
            {i > 0 && (
              <Arrow x1={cx} y1={y - step + h} x2={cx} y2={y} variant="logical" />
            )}
            <Node x={x} y={y} w={NW} h={h} label={l} variant="neutral" />
          </g>
        );
      })}
    </g>
  );
}

export function Figure12Pack() {
  return (
    <Figure
      number="12"
      title="Pack label dimensions before the exchange"
      subtitle="Moving label-dimension packing from the coordinator down to the data nodes separates step (outer LongHash key) from the packed label key and compresses what crosses the network — far less coordinator memory, and step bytes never enter the inner key."
      width={980}
      height={600}
    >
      {/* centre divider */}
      <Edge x1={490} y1={48} x2={490} y2={570} color={C.mediumGray} width={1} dashed />

      {/* ── BEFORE ── */}
      <Col
        cx={252}
        title="BEFORE"
        upper={["TS", "partial stats", "read label dims"]}
        packIndex={-1}
        netY={238}
        crossing={{
          thick: false,
          labels: [
            "step vector",
            "cluster vector",
            "namespace vector",
            "pod vector",
            "container vector",
            "…",
          ],
        }}
        lower={["build flat key (step+labels)", "final stats"]}
      />

      {/* ── AFTER ── */}
      <Col
        cx={728}
        title="AFTER"
        upper={["TS", "partial stats", "read label dims", "pack label dims"]}
        packIndex={3}
        netY={282}
        crossing={{
          thick: true,
          labels: ["step  →  { packed label key", "               + partial state }"],
        }}
        lower={["merge hierarchical states", "final stats"]}
      />

      {/* pack label dims annotation */}
      <rect x={728 - NW / 2 - 2} y={84 + 3 * 42 - 2} width={NW + 4} height={34}
        rx={9} fill="none" stroke={C.elasticBlue} strokeWidth={0} />
      <text x={728} y={84 + 3 * 42 + 30 + 14}
        textAnchor="middle" fontSize={9.5} fontStyle="italic" fill={C.darkBlue}>
        step = outer key · labels packed into inner key
      </text>

      <Annotation x={252} y={572} color={C.darkGray}>
        step + all label vectors cross the exchange
      </Annotation>
      <Annotation x={728} y={572} color={C.darkBlue}>
        one hierarchical partial state · step bytes stay outer
      </Annotation>
    </Figure>
  );
}
