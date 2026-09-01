import { Arrow, C, Figure, FONT_MONO, GroupLabel, TINT } from "../share"

const W = 960
const H = 360
const FRAME_X = 72
const FRAME_Y = 68
const FRAME_W = 834
const FRAME_H = 252
const FLOW_Y = 151
const FRAME_FILL = "rgba(247,249,252,0.62)"
const FRAME_STROKE = "#edf1f6"

function InputPage({ x, label }: { x: number label: string }) {
  const y = 113
  const w = 96
  const h = 76
  const columns = [
    { x: x + 7, width: 35, fill: TINT.physical, stroke: C.blue },
    { x: x + 45, width: 20, fill: TINT.semantic, stroke: C.teal },
    { x: x + 68, width: 21, fill: TINT.value, stroke: C.pink },
  ]

  return (
    <g>
      <rect
        x={x + 4}
        y={y - 3}
        width={w}
        height={h}
        fill={C.white}
        stroke={C.mediumGray}
        strokeWidth={0.45}
        opacity={0.5}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={C.white}
        stroke={C.darkGray}
        strokeWidth={0.75}
      />
      <text
        x={x + w / 2}
        y={y - 11}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={8}
        fontWeight={650}
        fill={C.faintInk}
      >
        {label}
      </text>
      {columns.map((column) => (
        <g key={column.x}>
          <rect
            x={column.x}
            y={y + 7}
            width={column.width}
            height={62}
            fill={column.fill}
            stroke={column.stroke}
            strokeWidth={0.45}
          />
          {[1, 2, 3].map((row) => (
            <line
              key={row}
              x1={column.x + 2}
              y1={y + 7 + row * 15.5}
              x2={column.x + column.width - 2}
              y2={y + 7 + row * 15.5}
              stroke={column.stroke}
              strokeWidth={0.35}
              opacity={0.42}
            />
          ))}
        </g>
      ))}
    </g>
  )
}

function InputPages() {
  return (
    <g>
      <InputPage x={96} label="PAGE 1" />
      <InputPage x={216} label="PAGE 2" />
    </g>
  )
}

function CollapsedPage({ x }: { x: number }) {
  const y = 103
  const w = 136
  const h = 96
  const blocks = [
    {
      label: "DIM",
      x: x + 7,
      width: 35,
      fill: TINT.physical,
      stroke: C.blue,
      counts: [1, 1],
    },
    {
      label: "STEP",
      x: x + 48,
      width: 38,
      fill: TINT.semantic,
      stroke: C.teal,
      counts: [2, 3],
    },
    {
      label: "VALUE",
      x: x + 92,
      width: 37,
      fill: TINT.value,
      stroke: C.pink,
      counts: [2, 3],
    },
  ]

  return (
    <g>
      <rect
        x={x + 4}
        y={y - 3}
        width={w}
        height={h}
        fill={C.white}
        stroke={C.mediumGray}
        strokeWidth={0.45}
        opacity={0.5}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={C.white}
        stroke={C.darkGray}
        strokeWidth={0.75}
      />
      <text
        x={x + w / 2}
        y={y - 11}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={8}
        fontWeight={650}
        fill={C.faintInk}
      >
        OUTPUT PAGE
      </text>
      {[0, 1].map((row) => (
        <line
          key={row}
          x1={x + 10}
          y1={y + 41 + row * 35}
          x2={x + 126}
          y2={y + 41 + row * 35}
          stroke={C.mediumGray}
          strokeWidth={0.45}
          strokeDasharray="2 2"
        />
      ))}
      {blocks.map((block) => (
        <g key={block.x}>
          <rect
            x={block.x}
            y={y + 7}
            width={block.width}
            height={82}
            fill={C.white}
            stroke={block.stroke}
            strokeWidth={0.55}
          />
          <text
            x={block.x + block.width / 2}
            y={y + 17}
            textAnchor="middle"
            fontFamily={FONT_MONO}
            fontSize={5.8}
            fontWeight={700}
            letterSpacing={0.3}
            fill={block.stroke}
          >
            {block.label}
          </text>
          {block.counts.map((count, row) => {
            const rowY = y + 22 + row * 35
            const gap = 2
            const innerWidth = (block.width - 10 - gap * (count - 1)) / count
            return (
              <g key={row}>
                <rect
                  x={block.x + 3}
                  y={rowY}
                  width={block.width - 6}
                  height={28}
                  fill={C.white}
                  stroke={block.stroke}
                  strokeWidth={0.35}
                  opacity={0.85}
                />
                {Array.from({ length: count }, (_, item) => (
                  <rect
                    key={item}
                    x={block.x + 5 + item * (innerWidth + gap)}
                    y={rowY + 4}
                    width={innerWidth}
                    height={20}
                    fill={block.fill}
                    stroke={block.stroke}
                    strokeWidth={0.35}
                  />
                ))}
              </g>
            )
          })}
        </g>
      ))}
    </g>
  )
}

function SerializeNode() {
  return (
    <g>
      <rect
        x={760}
        y={128}
        width={82}
        height={46}
        fill={C.white}
        stroke={C.mediumGray}
        strokeWidth={0.9}
      />
      <text
        x={801}
        y={151}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={9.5}
        fontWeight={520}
        fill={C.mutedInk}
      >
        Serialize
      </text>
    </g>
  )
}

function ResponseNode() {
  return (
    <g>
      <rect
        x={866}
        y={108}
        width={62}
        height={86}
        fill={C.white}
        stroke={C.darkGray}
        strokeWidth={0.75}
      />
      <text
        x={897}
        y={125}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={7.5}
        fontWeight={700}
        fill={C.mutedInk}
      >
        RESPONSE
      </text>
      <text
        x={876}
        y={148}
        fontFamily={FONT_MONO}
        fontSize={8.5}
        fill={C.darkTeal}
      >
        {"{"}
      </text>
      <rect
        x={887}
        y={142}
        width={28}
        height={3.5}
        fill={C.teal}
        opacity={0.5}
      />
      <rect
        x={887}
        y={156}
        width={23}
        height={3.5}
        fill={C.ink}
        opacity={0.34}
      />
      <rect
        x={887}
        y={170}
        width={31}
        height={3.5}
        fill={C.teal}
        opacity={0.4}
      />
      <text
        x={876}
        y={184}
        fontFamily={FONT_MONO}
        fontSize={8.5}
        fill={C.darkTeal}
      >
        {"}"}
      </text>
    </g>
  )
}

function Boundary({ x }: { x: number }) {
  return (
    <line
      x1={x}
      y1={FRAME_Y}
      x2={x}
      y2={FRAME_Y + FRAME_H}
      stroke={C.darkGray}
      strokeWidth={0.7}
      strokeDasharray="4 4"
      opacity={0.58}
    />
  )
}

function RowObjects() {
  return (
    <g>
      <text
        x={532}
        y={117}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={6.8}
        fontWeight={700}
        letterSpacing={0.35}
        fill={C.darkPoppy}
      >
        ROW OBJECTS
      </text>
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <rect
            x={506 + row * 2}
            y={126 + row * 18}
            width={52}
            height={13}
            fill={C.white}
            stroke={C.poppy}
            strokeWidth={0.55}
          />
          <rect
            x={510 + row * 2}
            y={129 + row * 18}
            width={20}
            height={7}
            fill={TINT.physical}
            stroke={C.blue}
            strokeWidth={0.3}
          />
          <rect
            x={533 + row * 2}
            y={129 + row * 18}
            width={8}
            height={7}
            fill={TINT.semantic}
            stroke={C.teal}
            strokeWidth={0.3}
          />
          <rect
            x={544 + row * 2}
            y={129 + row * 18}
            width={10}
            height={7}
            fill={TINT.value}
            stroke={C.pink}
            strokeWidth={0.3}
          />
        </g>
      ))}
    </g>
  )
}

function HeapObjectGraph() {
  const branches = [548, 612, 676]

  return (
    <g>
      <text
        x={612}
        y={93}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={8.5}
        fontWeight={700}
        letterSpacing={0.5}
        fill={C.darkPoppy}
      >
        HEAP OBJECT GRAPH
      </text>

      <rect
        x={575}
        y={130}
        width={74}
        height={42}
        fill="rgba(250,116,78,0.1)"
        stroke={C.poppy}
        strokeWidth={1.1}
      />
      <text
        x={612}
        y={151}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={8.5}
        fontWeight={650}
        fill={C.darkPoppy}
      >
        MAP
      </text>

      {branches.map((cx, branch) => (
        <g key={cx}>
          <line
            x1={612}
            y1={172}
            x2={cx}
            y2={204}
            stroke={C.poppy}
            strokeWidth={1}
          />
          <rect
            x={cx - 22}
            y={204}
            width={44}
            height={24}
            fill={C.white}
            stroke={C.poppy}
            strokeWidth={0.75}
          />
          <text
            x={cx}
            y={216}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily={FONT_MONO}
            fontSize={7}
            fill={C.darkPoppy}
          >
            LIST
          </text>
          {[0, 1, 2, 3].map((item) => {
            const leafX = cx - 27 + item * 18
            return (
              <g key={item}>
                <line
                  x1={cx}
                  y1={228}
                  x2={leafX + 6}
                  y2={255}
                  stroke={C.poppy}
                  strokeWidth={0.7}
                />
                {[2, 1].map((layer) => (
                  <rect
                    key={layer}
                    x={leafX + layer * 1.5}
                    y={255 - layer * 1.5}
                    width={12}
                    height={24}
                    fill="rgba(255,255,255,0.8)"
                    stroke={C.lightPoppy}
                    strokeWidth={0.45}
                  />
                ))}
                <rect
                  x={leafX}
                  y={255}
                  width={12}
                  height={24}
                  fill={C.white}
                  stroke={C.poppy}
                  strokeWidth={0.65}
                />
              </g>
            )
          })}
        </g>
      ))}
    </g>
  )
}

export function Figure14bStreamingResponse() {
  return (
    <Figure
      number="14b"
      title="Before: HTTP rebuilt a second in-memory representation"
      subtitle="Compact Page blocks ended at the compute boundary. HTTP expanded them into row objects, regrouped every sample into a heap graph, and retained that graph until serialization."
      width={W}
      height={H}
    >
      <GroupLabel x={FRAME_X} y={52}>
        COMPUTE ENGINE
      </GroupLabel>
      <GroupLabel x={516} y={52}>
        HTTP HANDLER
      </GroupLabel>
      <rect
        x={FRAME_X}
        y={FRAME_Y}
        width={FRAME_W}
        height={FRAME_H}
        fill={FRAME_FILL}
        stroke={FRAME_STROKE}
        strokeWidth={0.8}
      />
      <Boundary x={500} />

      <InputPages />
      <Arrow x1={326} y1={FLOW_Y} x2={498} y2={FLOW_Y} variant="muted" />
      <RowObjects />
      <Arrow x1={558} y1={FLOW_Y} x2={567} y2={FLOW_Y} variant="muted" />
      <HeapObjectGraph />

      <Arrow x1={649} y1={FLOW_Y} x2={752} y2={FLOW_Y} variant="muted" />
      <SerializeNode />
      <Arrow x1={842} y1={FLOW_Y} x2={858} y2={FLOW_Y} variant="muted" />
      <ResponseNode />
      <line
        x1={500}
        y1={301}
        x2={746}
        y2={301}
        stroke={C.poppy}
        strokeWidth={1.3}
      />
      <text
        x={623}
        y={314}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={7.3}
        fontWeight={700}
        letterSpacing={0.45}
        fill={C.darkPoppy}
      >
        PAGE BLOCKS → ROW OBJECTS → HEAP GRAPH
      </text>
    </Figure>
  )
}

export function Figure14cStreamingResponse() {
  return (
    <Figure
      number="14c"
      title="After: compute emits the regrouped result as Page blocks"
      subtitle="TimeSeriesCollapse performs the same blocking regrouping inside compute and emits one compact Page position per series. HTTP reads those blocks directly—no row objects and no second heap representation."
      width={W}
      height={H}
    >
      <GroupLabel x={FRAME_X} y={52}>
        COMPUTE ENGINE
      </GroupLabel>
      <GroupLabel x={716} y={52}>
        HTTP HANDLER
      </GroupLabel>
      <rect
        x={FRAME_X}
        y={FRAME_Y}
        width={FRAME_W}
        height={FRAME_H}
        fill={FRAME_FILL}
        stroke={FRAME_STROKE}
        strokeWidth={0.8}
      />
      <Boundary x={700} />

      <InputPages />
      <Arrow x1={326} y1={FLOW_Y} x2={362} y2={FLOW_Y} variant="muted" />
      <rect
        x={370}
        y={112}
        width={160}
        height={78}
        fill="rgba(8,154,150,0.1)"
        stroke={C.teal}
        strokeWidth={1.05}
      />
      <text
        x={450}
        y={128}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={9.2}
        fontWeight={650}
        fill={C.mutedInk}
      >
        TimeSeriesCollapse
      </text>
      <line
        x1={382}
        y1={139}
        x2={518}
        y2={139}
        stroke={C.teal}
        strokeWidth={0.45}
        opacity={0.55}
      />
      {[
        "GROUP dimension keys",
        "PLACE value at step ordinal",
        "EMIT aligned step[] / value[]",
      ].map((line, index) => (
        <text
          key={line}
          x={450}
          y={151 + index * 14}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={FONT_MONO}
          fontSize={6.8}
          fontWeight={index === 2 ? 650 : 500}
          fill={index === 2 ? C.darkTeal : C.mutedInk}
        >
          {line}
        </text>
      ))}
      <Arrow x1={530} y1={FLOW_Y} x2={544} y2={FLOW_Y} variant="semantic" />
      <CollapsedPage x={552} />

      <Arrow x1={692} y1={FLOW_Y} x2={752} y2={FLOW_Y} variant="semantic" />
      <SerializeNode />
      <Arrow x1={842} y1={FLOW_Y} x2={858} y2={FLOW_Y} variant="semantic" />
      <ResponseNode />
      <line
        x1={370}
        y1={301}
        x2={676}
        y2={301}
        stroke={C.teal}
        strokeWidth={1.3}
      />
      <text
        x={523}
        y={314}
        textAnchor="middle"
        fontFamily={FONT_MONO}
        fontSize={7.3}
        fontWeight={700}
        letterSpacing={0.45}
        fill={C.darkTeal}
      >
        PAGE BLOCKS → COLLAPSED PAGE BLOCKS
      </text>
    </Figure>
  )
}
