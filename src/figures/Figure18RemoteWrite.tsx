import { Figure } from "../diagram/Figure"
import {
  Node,
  Arrow,
  Boundary,
  Annotation,
  GroupLabel,
} from "../diagram/grammar"
import { C, TINT, FONT_MONO } from "../diagram/palette"

// FIGURE 18 — Prometheus Remote Write: encoding, wire format, and Elasticsearch ingest.
// Prometheus batches timeseries data as a protobuf WriteRequest (label names must be
// sorted by spec), applies Snappy framed-format compression, and HTTP-POSTs to ES.
// On the ES side the protobuf is parsed in a streaming fashion — one field at a time,
// no full object allocation — and the __name__ label is extracted as the dedicated
// metric-name field before documents are bulk-indexed into a metrics-prometheus.* data stream.

// ─── layout constants ──────────────────────────────────────────────────────
const BY = 60 // top of both panels

// LEFT: proto structure panel
const LX = 20
const LW = 372
const LBH = 282 // layered wire-format boundary height

// RIGHT: ES parse pipeline
const RX = 602
const RW = 358

// transport center x (for HTTP arrow + header labels)
const ARR_Y = BY + 118 // transport arrow through the encoded request body

// ES pipeline
const NH = 36 // node height
const NS = 52 // node step
const ES_NODES = [
  {
    label: "Snappy decompress",
    sub: "stream-id + chunks  →  raw proto bytes",
    variant: "physical" as const,
  },
  {
    label: "Protobuf unmarshal",
    sub: "streaming field parse · no full-graph alloc",
    variant: "neutral" as const,
  },
  {
    label: "__name__ extraction",
    sub: "remove from labels · store as metric-name field",
    variant: "semantic" as const,
  },
  {
    label: "Bulk index writer",
    sub: "flush batches  →  metrics-prometheus.*",
    variant: "physical" as const,
  },
]

// ─── normalization table rows ──────────────────────────────────────────────
const NORM_ROWS = [
  {
    from: '__name__ = "http_requests_total"',
    to: "prometheus.metrics.name",
    bold: true,
    fc: C.darkTeal,
    tc: C.darkTeal,
  },
  {
    from: 'instance = "10.0.0.1:9090"',
    to: "labels.instance",
    bold: false,
    fc: C.darkBlue,
    tc: C.darkBlue,
  },
  {
    from: 'job      = "api-server"',
    to: "labels.job",
    bold: false,
    fc: C.darkBlue,
    tc: C.darkBlue,
  },
  {
    from: "samples[0].value = 1423.0",
    to: "prometheus.metrics.value",
    bold: false,
    fc: C.ink,
    tc: C.ink,
  },
  {
    from: "samples[0].timestamp_ms",
    to: "@timestamp",
    bold: false,
    fc: C.ink,
    tc: C.ink,
  },
]
const NORM_BH = 22 + NORM_ROWS.length * 19 + 14 // boundary height

type WireSegment = {
  label: string
  sub?: string
  weight: number
  fill: string
  stroke: string
  color: string
}

const WIRE_ROWS: Array<{
  layer: string
  name: string
  note: string
  segments: WireSegment[]
}> = [
  {
    layer: "L3",
    name: "SNAPPY FRAME",
    note: "framed compressed byte stream",
    segments: [
      {
        label: "stream id",
        sub: "10 B",
        weight: 0.22,
        fill: TINT.physical,
        stroke: C.elasticBlue,
        color: C.darkBlue,
      },
      {
        label: "chunk hdr",
        sub: "type · len",
        weight: 0.23,
        fill: C.lightGray,
        stroke: C.mediumGray,
        color: C.darkGray,
      },
      {
        label: "compressed protobuf",
        sub: "payload bytes",
        weight: 0.45,
        fill: TINT.physical,
        stroke: C.elasticBlue,
        color: C.darkBlue,
      },
      {
        label: "…",
        weight: 0.1,
        fill: "none",
        stroke: C.mediumGray,
        color: C.darkGray,
      },
    ],
  },
  {
    layer: "L2",
    name: "WRITE REQUEST",
    note: "protobuf wire fields",
    segments: [
      {
        label: "tag",
        sub: "ts",
        weight: 0.09,
        fill: C.lightGray,
        stroke: C.mediumGray,
        color: C.darkGray,
      },
      {
        label: "len",
        weight: 0.09,
        fill: "none",
        stroke: C.mediumGray,
        color: C.darkGray,
      },
      {
        label: "TimeSeries[0]",
        weight: 0.29,
        fill: TINT.semantic,
        stroke: C.teal,
        color: C.darkTeal,
      },
      {
        label: "tag",
        sub: "ts",
        weight: 0.09,
        fill: C.lightGray,
        stroke: C.mediumGray,
        color: C.darkGray,
      },
      {
        label: "len",
        weight: 0.09,
        fill: "none",
        stroke: C.mediumGray,
        color: C.darkGray,
      },
      {
        label: "TimeSeries[1]",
        weight: 0.27,
        fill: "rgba(2,188,183,0.05)",
        stroke: C.teal,
        color: C.darkTeal,
      },
      {
        label: "…",
        weight: 0.08,
        fill: "none",
        stroke: C.mediumGray,
        color: C.darkGray,
      },
    ],
  },
  {
    layer: "L1",
    name: "TIMESERIES[0]",
    note: "nested message fields",
    segments: [
      {
        label: "tag · len",
        sub: "labels",
        weight: 0.18,
        fill: C.lightGray,
        stroke: C.mediumGray,
        color: C.darkGray,
      },
      {
        label: "Label[0..n]",
        sub: "sorted names",
        weight: 0.35,
        fill: TINT.semantic,
        stroke: C.teal,
        color: C.darkTeal,
      },
      {
        label: "tag · len",
        sub: "samples",
        weight: 0.18,
        fill: C.lightGray,
        stroke: C.mediumGray,
        color: C.darkGray,
      },
      {
        label: "Sample[0..m]",
        sub: "t · value",
        weight: 0.29,
        fill: "none",
        stroke: C.mediumGray,
        color: C.ink,
      },
    ],
  },
]

function WireRow({
  y,
  layer,
  name,
  note,
  segments,
}: {
  y: number
  layer: string
  name: string
  note: string
  segments: WireSegment[]
}) {
  const labelW = 92
  const barX = LX + labelW
  const barW = LW - labelW - 12
  const h = 40
  let cursor = barX

  return (
    <g>
      <text
        x={LX + 12}
        y={y + 11}
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={7.5}
        fontWeight={700}
        fill={C.mediumGray}
      >
        {layer}
      </text>
      <text
        x={LX + 12}
        y={y + 23}
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={8.5}
        fontWeight={700}
        fill={C.ink}
      >
        {name}
      </text>
      <text
        x={LX + 12}
        y={y + 34}
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={6.7}
        fill={C.darkGray}
      >
        {note}
      </text>

      {segments.map((seg, i) => {
        const sw =
          i === segments.length - 1
            ? barX + barW - cursor
            : Math.round(barW * seg.weight)
        const sx = cursor
        cursor += sw
        return (
          <g key={i}>
            <rect
              x={sx}
              y={y}
              width={sw}
              height={h}
              fill={seg.fill}
              stroke={seg.stroke}
              strokeWidth={0.75}
            />
            <text
              x={sx + sw / 2}
              y={y + (seg.sub ? 15 : 20)}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={7.5}
              fontWeight={600}
              fill={seg.color}
            >
              {seg.label}
            </text>
            {seg.sub && (
              <text
                x={sx + sw / 2}
                y={y + 28}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily={FONT_MONO}
                fontSize={6.7}
                fill={seg.color}
              >
                {seg.sub}
              </text>
            )}
          </g>
        )
      })}
    </g>
  )
}

function FieldStrip({
  y,
  title,
  fields,
}: {
  y: number
  title: string
  fields: Array<{ label: string weight: number color?: string bold?: boolean }>
}) {
  const titleW = 76
  const x = LX + 12
  const w = LW - 24
  const barX = x + titleW
  const barW = w - titleW
  let cursor = barX

  return (
    <g>
      <text
        x={x}
        y={y + 13}
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={7.5}
        fontWeight={700}
        fill={C.darkGray}
      >
        {title}
      </text>
      {fields.map((field, i) => {
        const fw =
          i === fields.length - 1
            ? barX + barW - cursor
            : Math.round(barW * field.weight)
        const fx = cursor
        cursor += fw
        return (
          <g key={i}>
            <rect
              x={fx}
              y={y}
              width={fw}
              height={26}
              fill={i % 2 === 0 ? C.lightGray : "none"}
              stroke={C.mediumGray}
              strokeWidth={0.65}
            />
            <text
              x={fx + fw / 2}
              y={y + 13}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={7.1}
              fontWeight={field.bold ? 700 : 400}
              fill={field.color ?? C.ink}
            >
              {field.label}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export function Figure18RemoteWrite() {
  const lastNodeBottom = BY + (ES_NODES.length - 1) * NS + NH
  const normY = lastNodeBottom + 18
  const canvasH = normY + NORM_BH + 44
  const wireStartY = BY + 28
  const wireStep = 54

  return (
    <Figure
      number="18"
      title="Prometheus Remote Write: encoding and Elasticsearch ingest"
      subtitle="Prometheus serialises time series as a protobuf WriteRequest (label names must be sorted), applies Snappy framed-format compression, and HTTP-POSTs to Elasticsearch. ES parses the protobuf in a streaming fashion — one field at a time, no object graph allocation — extracts __name__ as the dedicated metric-name field, and bulk-indexes into a metrics-prometheus.* data stream."
      width={980}
      height={canvasH}
    >
      {/* ════════════════════════════════════════════════════════════════
          LEFT — encoded request body as protocol layers
      ════════════════════════════════════════════════════════════════ */}
      <GroupLabel x={LX} y={BY - 18}>
        PROMETHEUS AGENT — REQUEST BODY
      </GroupLabel>

      <Boundary
        x={LX}
        y={BY}
        w={LW}
        h={LBH}
        label="Binary wire format"
        color={C.teal}
      />

      {WIRE_ROWS.map((row, i) => {
        const y = wireStartY + i * wireStep
        return (
          <g key={row.layer}>
            {i > 0 && (
              <Arrow
                x1={LX + LW - 28}
                y1={y - 14}
                x2={LX + LW - 28}
                y2={y - 4}
                variant="logical"
              />
            )}
            <WireRow y={y} {...row} />
          </g>
        )
      })}

      <FieldStrip
        y={wireStartY + WIRE_ROWS.length * wireStep + 3}
        title="LABEL"
        fields={[
          {
            label: '__name__ = "http_requests_total"',
            weight: 0.58,
            color: C.darkTeal,
            bold: true,
          },
          { label: 'job = "api-server"', weight: 0.42, color: C.darkBlue },
        ]}
      />
      <FieldStrip
        y={wireStartY + WIRE_ROWS.length * wireStep + 34}
        title="SAMPLE"
        fields={[
          { label: "t = 1720000000000 ms", weight: 0.56 },
          { label: "v = 1423.0 (f64)", weight: 0.44 },
        ]}
      />

      <Annotation x={LX + LW / 2} y={BY + LBH + 16} size={8.5}>
        outer bytes decode inward: Snappy → WriteRequest → TimeSeries → fields
      </Annotation>

      {/* ════════════════════════════════════════════════════════════════
          CENTER — HTTP transport arrow + headers
      ════════════════════════════════════════════════════════════════ */}
      <Arrow
        x1={LX + LW + 10}
        y1={ARR_Y}
        x2={RX - 10}
        y2={ARR_Y}
        variant="network"
      />

      <text
        x={(LX + LW + RX) / 2}
        y={ARR_Y - 15}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={10}
        fontWeight={700}
        fill={C.ink}
      >
        HTTP POST
      </text>
      <text
        x={(LX + LW + RX) / 2}
        y={ARR_Y + 14}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={8}
        fill={C.darkGray}
      >
        /_prometheus/metrics
      </text>

      {/* HTTP headers */}
      {[
        "Content-Type: application/x-protobuf",
        "Content-Encoding: snappy",
        "X-Prom-RW-Version: 0.1.0",
      ].map((hdr, i) => (
        <g key={i}>
          <rect
            x={LX + LW + 10}
            y={ARR_Y + 30 + i * 18}
            width={RX - LX - LW - 20}
            height={15}
            rx={3}
            fill={C.lightGray}
            stroke={C.mediumGray}
            strokeWidth={0.6}
          />
          <text
            x={(LX + LW + RX) / 2}
            y={ARR_Y + 30 + i * 18 + 7.5}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily={FONT_MONO}
            fontSize={7.5}
            fill={C.darkGray}
          >
            {hdr}
          </text>
        </g>
      ))}

      {/* ════════════════════════════════════════════════════════════════
          RIGHT — Elasticsearch ingest pipeline
      ════════════════════════════════════════════════════════════════ */}
      <GroupLabel x={RX} y={BY - 18}>
        ELASTICSEARCH — INGEST PIPELINE
      </GroupLabel>

      {ES_NODES.map((n, i) => {
        const ny = BY + i * NS
        return (
          <g key={i}>
            {i > 0 && (
              <Arrow
                x1={RX + RW / 2}
                y1={ny - NS + NH}
                x2={RX + RW / 2}
                y2={ny}
                variant="logical"
              />
            )}
            <Node
              x={RX}
              y={ny}
              w={RW}
              h={NH}
              label={n.label}
              sub={n.sub}
              variant={n.variant}
            />
          </g>
        )
      })}

      {/* ─ Normalization detail callout ─ */}
      <Boundary
        x={RX}
        y={normY}
        w={RW}
        h={NORM_BH}
        label="Label mapping — __name__ extraction"
        color={C.teal}
      />

      {NORM_ROWS.map((row, i) => {
        const ry = normY + 22 + i * 19
        const midX = RX + Math.round(RW * 0.56)
        return (
          <g key={i}>
            <text
              x={RX + 14}
              y={ry}
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={8}
              fontWeight={row.bold ? 700 : 400}
              fill={row.fc}
            >
              {row.from}
            </text>
            <text
              x={midX}
              y={ry}
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={9}
              fill={C.mediumGray}
            >
              →
            </text>
            <text
              x={midX + 14}
              y={ry}
              dominantBaseline="central"
              fontFamily={FONT_MONO}
              fontSize={8}
              fontWeight={row.bold ? 700 : 400}
              fill={row.tc}
            >
              {row.to}
            </text>
          </g>
        )
      })}

      <Annotation
        x={RX + RW / 2}
        y={normY + NORM_BH + 16}
        size={9.5}
        color={C.darkBlue}
      >
        one doc per sample · metrics-prometheus.* · @timestamp from ms
      </Annotation>
    </Figure>
  )
}
