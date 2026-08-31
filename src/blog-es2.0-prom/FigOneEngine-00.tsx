import { Figure } from "../share"
import { Node, Arrow, GroupLabel } from "../share"
import { C, FONT_MONO, TINT } from "../share"

// FIGURE 13 — The shared engine (light, concluding). The technically informed
// echo of Figure 01: PromQL owns semantics, Elasticsearch owns execution.
export function Figure13SharedEngine() {
  const leftX = 72
  const mainX = 72
  const engineW = 834
  const plannerW = engineW
  const frameCx = mainX + engineW / 2
  const esCx = frameCx - 154
  const promCx = frameCx + 154
  const frontendY = 112
  const plannerY = 204
  const engineY = 342
  const engineH = 218
  const rowYs = [engineY + 66, engineY + 166]
  const rowStorageX = mainX + 18
  const rowStorageW = 86
  const rowStorageH = 74
  const rowPageX = mainX + 132
  const rowPageW = 64
  const rowPageH = 64
  const rowOpW = 76
  const rowOpH = 36
  const rowEllipsisW = 42
  const rowFilterX = mainX + 236
  const rowAggX = mainX + 347
  const rowEvalX = mainX + 428
  const exchangeX = mainX + 536
  const exchangeY = engineY + 98
  const exchangeW = 94
  const exchangeH = 54
  const exchangeCy = exchangeY + exchangeH / 2
  const continuationX = mainX + 652
  const continuationW = 42
  const continuationH = 34
  const continuationY = exchangeCy - continuationH / 2
  const finalX = mainX + 718
  const finalW = 76
  const finalH = 76
  const finalY = exchangeCy - finalH / 2
  const finalCy = finalY + finalH / 2
  const contextFill = "rgba(247,249,252,0.62)"
  const contextStroke = "#edf1f6"
  const operatorFill = "rgba(255,255,255,0.88)"
  const captionSize = 8.5
  const vectorColumns = [
    { fill: TINT.physical, stroke: C.blue },
    { fill: TINT.semantic, stroke: C.teal },
    { fill: TINT.value, stroke: C.pink },
    { fill: C.lightGray, stroke: C.darkGray },
  ]
  const plannerNodeY = plannerY + 32
  const plannerNodeW = 142
  const logicalCx = esCx
  const optimizerCx = frameCx
  const physicalCx = promCx
  const logicalX = logicalCx - plannerNodeW / 2
  const optimizerX = optimizerCx - plannerNodeW / 2
  const physicalX = physicalCx - plannerNodeW / 2
  const EngineArrow = ({
    x1,
    y1,
    x2,
    y2,
    tone = "primary",
  }: {
    x1: number
    y1: number
    x2: number
    y2: number
    tone?: "primary" | "muted"
  }) => {
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.hypot(dx, dy) || 1
    const ux = dx / len
    const uy = dy / len
    const head = 4.9
    const half = 3.2
    const bx = x2 - ux * head
    const by = y2 - uy * head
    const px = -uy * half
    const py = ux * half
    const stroke = tone === "primary" ? C.blue : C.darkGray

    return (
      <g>
        <line
          x1={x1}
          y1={y1}
          x2={bx}
          y2={by}
          stroke={stroke}
          strokeWidth={tone === "primary" ? 1.35 : 1.1}
          strokeLinecap="round"
        />
        <polygon
          points={`${x2},${y2} ${bx + px},${by + py} ${bx - px},${by - py}`}
          fill={stroke}
        />
      </g>
    )
  }
  const EngineOperator = ({
    x,
    y,
    w,
    h,
    label,
    stroke,
    fill,
  }: {
    x: number
    y: number
    w: number
    h: number
    label: string
    stroke: string
    fill: string
  }) => (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        stroke={stroke}
        strokeWidth={0.95}
      />
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={11.5}
        fontWeight={500}
        fill={C.mutedInk}
      >
        {label}
      </text>
    </g>
  )
  const StorageCylinder = ({
    x,
    cy,
    w,
    h,
    label,
    offset = 0,
  }: {
    x: number
    cy: number
    w: number
    h: number
    label: string
    offset?: number
  }) => {
    const y = cy - h / 2
    const cols = 4
    const cellW = 12.6
    const cellH = 8.2
    const gap = 3.2
    const gridMarks = [
      { col: 0, row: 0, vector: 0 },
      { col: 1, row: 0, vector: 0 },
      { col: 2 + offset, row: 0, vector: 0 },
      { col: 1, row: 1, vector: 1 },
      { col: 2, row: 1, vector: 1 },
      { col: 0 + offset, row: 2, vector: 2 },
      { col: 1 + offset, row: 2, vector: 2 },
    ]
    const gridW = cols * cellW + (cols - 1) * gap
    const gridX = x + 8 + (w - 16 - gridW) / 2
    const gridY = y + 27

    return (
      <g>
        <text
          x={x + w / 2}
          y={y - 7}
          textAnchor="middle"
          fontFamily={FONT_MONO}
          fontSize={captionSize}
          fontWeight={650}
          fill={C.faintInk}
        >
          {label}
        </text>
        <path
          d={`M ${x + 7} ${y + 14}
              C ${x + 7} ${y + 5}, ${x + w - 7} ${y + 5}, ${x + w - 7} ${y + 14}
              L ${x + w - 7} ${y + h - 14}
              C ${x + w - 7} ${y + h - 5}, ${x + 7} ${y + h - 5}, ${x + 7} ${y + h - 14}
              Z`}
          fill={C.white}
          stroke={C.darkGray}
          strokeWidth={0.65}
        />
        <path
          d={`M ${x + 7} ${y + h - 14}
              C ${x + 7} ${y + h - 5}, ${x + w - 7} ${y + h - 5}, ${x + w - 7} ${y + h - 14}`}
          fill="none"
          stroke={C.darkGray}
          strokeWidth={0.65}
        />
        {gridMarks.map(({ col, row, vector }, i) => {
          const column = vectorColumns[vector]

          return (
            <rect
              key={i}
              x={gridX + col * (cellW + gap)}
              y={gridY + row * (cellH + gap)}
              width={cellW}
              height={cellH}
              fill={column.fill}
              stroke={column.stroke}
              strokeWidth={0.32}
            />
          )
        })}
        <ellipse
          cx={x + w / 2}
          cy={y + 14}
          rx={w / 2 - 7}
          ry={8}
          fill={C.lightGray}
          stroke={C.darkGray}
          strokeWidth={0.65}
        />
      </g>
    )
  }
  const PageStack = ({
    x,
    cy,
    w,
    h,
    label,
    final,
  }: {
    x: number
    cy: number
    w: number
    h: number
    label?: string
    final?: boolean
  }) => {
    const y = cy - h / 2
    const columns = final ? vectorColumns.slice(0, 3) : vectorColumns
    const bodyY = y + 5
    const bodyH = h - 10
    const sidePadding = final ? 6 : 4
    const laneGap = final ? 7 : 4
    const laneW = (w - sidePadding * 2 - (columns.length - 1) * laneGap) / columns.length
    const lanesX = x + sidePadding

    return (
      <g>
        {[2, 1].map((i) => (
          <rect
            key={i}
            x={x + i * 4.5}
            y={y - i * 3.2}
            width={w}
            height={h}
            fill={C.white}
            stroke={C.mediumGray}
            strokeWidth={0.5}
            opacity={0.54}
          />
        ))}
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={C.white}
          stroke={C.darkGray}
          strokeWidth={0.85}
        />
        {label && (
          <text
            x={x + w / 2}
            y={y - 11}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily={FONT_MONO}
            fontSize={captionSize}
            fontWeight={650}
            fill={C.faintInk}
          >
            {label}
          </text>
        )}
        {columns.map((column, col) => {
          const laneX = lanesX + col * (laneW + laneGap)

          return (
            <g key={col}>
              <rect
                x={laneX}
                y={bodyY}
                width={laneW}
                height={bodyH}
              fill={column.fill}
              stroke={column.stroke}
              strokeWidth={0.65}
            />
              {final && (
                <line
                  x1={laneX + 2}
                  y1={bodyY + bodyH / 2}
                  x2={laneX + laneW - 2}
                  y2={bodyY + bodyH / 2}
                  stroke={column.stroke}
                  strokeWidth={0.35}
                  opacity={0.22}
                />
              )}
            </g>
          )
        })}
      </g>
    )
  }

  return (
    <Figure
      number="13"
      title="One shared engine, two language frontends"
      subtitle="PromQL and ES|QL both lower into the same optimizer and distributed compute. PromQL owns Prometheus semantics; Elasticsearch owns execution."
      width={960}
      height={580}
    >
      <GroupLabel x={leftX} y={96}>
        LANGUAGE FRONTENDS
      </GroupLabel>

      <Node
        x={esCx - 75}
        y={frontendY}
        w={150}
        h={42}
        label="ES|QL"
        variant="neutral"
      />
      <Node
        x={promCx - 75}
        y={frontendY}
        w={150}
        h={42}
        label="PromQL"
        variant="semantic"
      />
      <GroupLabel x={mainX} y={plannerY - 18}>
        SHARED PLANNER
      </GroupLabel>
      <rect
        x={mainX}
        y={plannerY}
        width={plannerW}
        height={94}
        fill={contextFill}
        stroke={contextStroke}
        strokeWidth={0.8}
      />
      <Node
        x={logicalX}
        y={plannerNodeY}
        w={plannerNodeW}
        h={36}
        label="LogicalPlan"
        variant="neutral"
        mono
      />
      <Node
        x={optimizerX}
        y={plannerNodeY}
        w={plannerNodeW}
        h={36}
        label="Optimizer"
        variant="neutral"
        mono
      />
      <Node
        x={physicalX}
        y={plannerNodeY}
        w={plannerNodeW}
        h={36}
        label="PhysicalPlan"
        variant="physical"
        mono
      />

      <Arrow
        x1={esCx}
        y1={frontendY + 42}
        x2={esCx}
        y2={plannerY}
        variant="muted"
      />
      <Arrow
        x1={promCx}
        y1={frontendY + 42}
        x2={promCx}
        y2={plannerY}
        variant="muted"
      />
      <EngineArrow
        x1={logicalX + plannerNodeW}
        y1={plannerNodeY + 18}
        x2={optimizerX}
        y2={plannerNodeY + 18}
        tone="muted"
      />
      <EngineArrow
        x1={optimizerX + plannerNodeW}
        y1={plannerNodeY + 18}
        x2={physicalX}
        y2={plannerNodeY + 18}
        tone="muted"
      />

      <GroupLabel x={mainX} y={engineY - 18}>
        EXECUTION DAG
      </GroupLabel>
      <rect
        x={mainX}
        y={engineY}
        width={engineW}
        height={engineH}
        fill={contextFill}
        stroke={contextStroke}
        strokeWidth={0.8}
      />
      {rowYs.map((rowY, row) => {
        const storageCy = rowY
        const pageCy = rowY
        const opY = rowY - rowOpH / 2
        const opCy = rowY

        return (
          <g key={row}>
            <StorageCylinder
              x={rowStorageX}
              cy={storageCy}
              w={rowStorageW}
              h={rowStorageH}
              label={row === 0 ? "SHARD 1" : "SHARD N"}
              offset={row}
            />
            <EngineArrow x1={rowStorageX + rowStorageW - 5} y1={rowY} x2={rowPageX} y2={pageCy} tone="muted" />
            <PageStack
              x={rowPageX}
              cy={pageCy}
              w={rowPageW}
              h={rowPageH}
            />
            <EngineArrow x1={rowPageX + rowPageW + 12} y1={rowY} x2={rowFilterX} y2={opCy} tone="muted" />
            <EngineOperator
              x={rowFilterX}
              y={opY}
              w={rowOpW}
              h={rowOpH}
              label="Filter"
              stroke={C.mediumGray}
              fill={operatorFill}
            />
            <EngineArrow x1={rowFilterX + rowOpW} y1={opCy} x2={rowAggX} y2={opCy} tone="muted" />
            <EngineOperator
              x={rowAggX}
              y={opY}
              w={rowEllipsisW}
              h={rowOpH}
              label="..."
              stroke={C.mediumGray}
              fill={operatorFill}
            />
            <EngineArrow x1={rowAggX + rowEllipsisW} y1={opCy} x2={rowEvalX} y2={opCy} tone="muted" />
            <EngineOperator
              x={rowEvalX}
              y={opY}
              w={rowOpW}
              h={rowOpH}
              label="Eval"
              stroke={C.mediumGray}
              fill={operatorFill}
            />
            <EngineArrow x1={rowEvalX + rowOpW} y1={opCy} x2={exchangeX} y2={exchangeCy} />
          </g>
        )
      })}

      <EngineOperator
        x={exchangeX}
        y={exchangeY}
        w={exchangeW}
        h={exchangeH}
        label="Exchange"
        stroke={C.blue}
        fill={TINT.physical}
      />
      <EngineOperator
        x={continuationX}
        y={continuationY}
        w={continuationW}
        h={continuationH}
        label="..."
        stroke={C.mediumGray}
        fill={operatorFill}
      />
      <EngineArrow
        x1={exchangeX + exchangeW}
        y1={exchangeCy}
        x2={continuationX}
        y2={exchangeCy}
      />
      <EngineArrow
        x1={continuationX + continuationW}
        y1={exchangeCy}
        x2={finalX}
        y2={finalCy}
      />
      <PageStack x={finalX} cy={finalCy} w={finalW} h={finalH} label="FINAL PAGE" final />

      <Arrow
        x1={mainX + engineW / 2}
        y1={plannerY + 94}
        x2={mainX + engineW / 2}
        y2={engineY}
        variant="muted"
      />

    </Figure>
  )
}
