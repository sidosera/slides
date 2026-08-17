import { Figure } from "../diagram/Figure";
import { C, TINT, FONT_MONO } from "../diagram/palette";

// FIGURE 14b — Page & Block internals: three visual concepts.
// Sources: org.elasticsearch.compute.data (x-pack/plugin/esql/compute)
//
// Concept 1 — A Page is a columnar batch: one typed Block per column.
// Concept 2 — Four Block storage flavours (Vector, ArrayBlock, Constant, Ordinal).
// Concept 3 — A position can hold multiple values or be null.

const W = 960;
const MONO = FONT_MONO;

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT 1 — Page as columnar batch
// ─────────────────────────────────────────────────────────────────────────────
const C1_TOP  = 56;
const C1_ROWS = 5;           // rows shown (positionCount = 5)
const C1_CH   = 34;          // cell height
const C1_CW   = 140;         // cell width
const C1_GAP  = 10;
const C1_HDR  = 32;          // header height

const COLS = [
  { type: "IntBlock",      field: "pod_id",    color: C.darkBlue,  stroke: C.elasticBlue, fill: TINT.physical, vals: ["1","1","2","3","3"] },
  { type: "LongBlock",     field: "timestamp", color: C.darkTeal,  stroke: C.teal,        fill: TINT.semantic, vals: ["t₀","t₁","t₀","t₀","t₁"] },
  { type: "DoubleBlock",   field: "value",     color: C.ink,       stroke: C.mediumGray,  fill: C.lightGray,   vals: ["0.42","1.7","0.9","0.3","2.1"] },
  { type: "BytesRefBlock", field: "service",   color: C.darkGray,  stroke: C.darkGray,    fill: "rgba(171,180,196,0.15)", vals: ["nginx","nginx","envoy","envoy","redis"] },
];

const C1_TOTAL_W = COLS.length * C1_CW + (COLS.length - 1) * C1_GAP;
const C1_X0      = (W - C1_TOTAL_W) / 2;
const C1_BLK_H   = C1_HDR + C1_ROWS * C1_CH;

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT 2 — Four storage flavours
// ─────────────────────────────────────────────────────────────────────────────
const C2_TOP  = C1_TOP + C1_BLK_H + 70;
const C2_W    = 208;
const C2_H    = 200;
const C2_GAP  = 18;
const C2_X0   = (W - 4 * C2_W - 3 * C2_GAP) / 2;

const F_ROWS  = 5;  // number of row slots per flavour
const F_CH    = 26;
const F_CW    = 120;

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT 3 — Position vs value (multi-valued + null)
// ─────────────────────────────────────────────────────────────────────────────
const C3_TOP  = C2_TOP + C2_H + 70;
const C3_H    = 130;

// 5 positions: single, multi(2), single, null, multi(3)
const POSITIONS = [
  { vals: ["42"],             isNull: false },
  { vals: ["7", "99"],        isNull: false },
  { vals: ["13"],             isNull: false },
  { vals: [],                 isNull: true  },
  { vals: ["5", "18", "27"],  isNull: false },
];

const P_W    = 84;
const P_H    = 32;
const P_GAP  = 16;
const P_TOTAL = POSITIONS.length * P_W + (POSITIONS.length - 1) * P_GAP;
const P_X0    = (W - P_TOTAL) / 2;

// ─────────────────────────────────────────────────────────────────────────────
// helper: concept label
// ─────────────────────────────────────────────────────────────────────────────
function ConceptLabel({ x, y, num, text }: { x: number; y: number; num: string; text: string }) {
  return (
    <g>
      <circle cx={x + 10} cy={y} r={10} fill={C.elasticBlue} />
      <text x={x + 10} y={y} textAnchor="middle" dominantBaseline="central"
        fontSize={10} fontWeight={700} fill={C.white} fontFamily={MONO}>
        {num}
      </text>
      <text x={x + 26} y={y} dominantBaseline="central"
        fontSize={11} fontWeight={700} fill={C.darkInk}>
        {text}
      </text>
    </g>
  );
}

// legend row sits centered below the position strip
const LEG_ITEMS = [
  { color: C.elasticBlue, fill: TINT.physical,           label: "single value (Vector)",       w: 170 },
  { color: C.teal,        fill: TINT.semantic,           label: "multi-value (ArrayBlock MV)", w: 210 },
  { color: C.poppy,       fill: "rgba(250,116,78,0.09)", label: "null (getValueCount = 0)",     w: 190 },
] as const;
const LEG_TOTAL = LEG_ITEMS.reduce((s, l) => s + l.w, 0);
const LEG_X0    = (W - LEG_TOTAL) / 2;

export function Figure14bPageInternals() {
  const LEG_Y   = C3_TOP + 150;
  const TOTAL_H = LEG_Y + 34;

  return (
    <Figure
      number="14b"
      title="Page and Block internals — three core concepts"
      subtitle="org.elasticsearch.compute.data — all typed Block/Vector classes are code-generated. $Type$ expands to Int · Long · Double · BytesRef · Boolean."
      width={W}
      height={TOTAL_H}
    >

      {/* ══════════════════════════════════════════════════════════════
          CONCEPT 1 — Page = columnar batch
      ══════════════════════════════════════════════════════════════ */}
      <ConceptLabel x={C1_X0} y={C1_TOP - 20} num="1" text="A Page is a batch of typed column arrays — one Block per field" />

      {COLS.map((col, ci) => {
        const cx = C1_X0 + ci * (C1_CW + C1_GAP);
        return (
          <g key={ci}>
            {/* type badge */}
            <rect x={cx} y={C1_TOP - 4} width={C1_CW} height={18} rx={4}
              fill={col.fill} stroke={col.stroke} strokeWidth={1} />
            <text x={cx + C1_CW / 2} y={C1_TOP + 5} textAnchor="middle"
              dominantBaseline="central" fontFamily={MONO} fontSize={9} fontWeight={700}
              fill={col.color}>
              {col.type}
            </text>

            {/* column body */}
            <rect x={cx} y={C1_TOP + 14} width={C1_CW} height={C1_BLK_H} rx={5}
              fill="none" stroke={col.stroke} strokeWidth={1.5} />

            {/* field header */}
            <rect x={cx} y={C1_TOP + 14} width={C1_CW} height={C1_HDR}
              rx={5} fill={col.fill} stroke="none" />
            {/* fix bottom corners of header */}
            <rect x={cx} y={C1_TOP + 26} width={C1_CW} height={C1_HDR - 12}
              fill={col.fill} stroke="none" />
            <line x1={cx} y1={C1_TOP + 14 + C1_HDR} x2={cx + C1_CW} y2={C1_TOP + 14 + C1_HDR}
              stroke={col.stroke} strokeWidth={0.75} />
            <text x={cx + C1_CW / 2} y={C1_TOP + 14 + C1_HDR / 2}
              textAnchor="middle" dominantBaseline="central"
              fontFamily={MONO} fontSize={9} fontWeight={600} fill={col.color}>
              {col.field}
            </text>

            {/* row cells */}
            {col.vals.map((v, ri) => {
              const ry = C1_TOP + 14 + C1_HDR + ri * C1_CH;
              return (
                <g key={ri}>
                  {ri > 0 && (
                    <line x1={cx} y1={ry} x2={cx + C1_CW} y2={ry}
                      stroke={col.stroke} strokeWidth={0.35} opacity={0.4} />
                  )}
                  <text x={cx + C1_CW / 2} y={ry + C1_CH / 2}
                    textAnchor="middle" dominantBaseline="central"
                    fontFamily={MONO} fontSize={12} fontWeight={600} fill={col.color}>
                    {v}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* positionCount brace */}
      {(() => {
        const bx = C1_X0 - 18;
        const by1 = C1_TOP + 14 + C1_HDR;
        const by2 = C1_TOP + 14 + C1_BLK_H;
        return (
          <g>
            <line x1={bx} y1={by1} x2={bx} y2={by2} stroke={C.mediumGray} strokeWidth={1.25} />
            <line x1={bx} y1={by1} x2={bx + 6} y2={by1} stroke={C.mediumGray} strokeWidth={1.25} />
            <line x1={bx} y1={by2} x2={bx + 6} y2={by2} stroke={C.mediumGray} strokeWidth={1.25} />
            <text x={bx - 4} y={(by1 + by2) / 2} textAnchor="end" dominantBaseline="central"
              fontSize={9} fill={C.darkGray} fontFamily={MONO}>
              positionCount
            </text>
            <text x={bx - 4} y={(by1 + by2) / 2 + 13} textAnchor="end" dominantBaseline="central"
              fontSize={9} fontWeight={700} fill={C.darkGray} fontFamily={MONO}>
              = 5
            </text>
          </g>
        );
      })()}

      {/* Page label */}
      <rect x={C1_X0 + C1_TOTAL_W + 10} y={C1_TOP + 14} width={90} height={C1_BLK_H}
        rx={6} fill="rgba(11,100,221,0.04)" stroke={C.elasticBlue} strokeWidth={1}
        strokeDasharray="4 3" />
      <text x={C1_X0 + C1_TOTAL_W + 55} y={C1_TOP + 14 + C1_BLK_H / 2 - 8}
        textAnchor="middle" dominantBaseline="central"
        fontSize={11} fontWeight={700} fill={C.darkBlue}>
        Page
      </text>
      <text x={C1_X0 + C1_TOTAL_W + 55} y={C1_TOP + 14 + C1_BLK_H / 2 + 8}
        textAnchor="middle" dominantBaseline="central"
        fontSize={9} fill={C.darkBlue} fontFamily={MONO}>
        Block[ ] blocks
      </text>

      {/* ══════════════════════════════════════════════════════════════
          CONCEPT 2 — Four storage flavours
      ══════════════════════════════════════════════════════════════ */}
      <ConceptLabel x={C2_X0} y={C2_TOP - 20} num="2" text="Four ways a Block stores its values" />

      {/* ── Flavour A: dense Vector (no nulls, single value) ── */}
      {(() => {
        const fx = C2_X0;
        const vals = ["42", "7", "13", "99", "5"];
        return (
          <g>
            <rect x={fx} y={C2_TOP} width={C2_W} height={C2_H} rx={8}
              fill={TINT.physical} stroke={C.elasticBlue} strokeWidth={1.5} />
            <text x={fx + C2_W / 2} y={C2_TOP + 18} textAnchor="middle"
              dominantBaseline="central" fontFamily={MONO} fontSize={10} fontWeight={700}
              fill={C.darkBlue}>
              Vector
            </text>
            <text x={fx + C2_W / 2} y={C2_TOP + 32} textAnchor="middle"
              dominantBaseline="central" fontSize={9} fill={C.darkBlue}>
              dense · no nulls · single value
            </text>
            {vals.map((v, i) => {
              const cy = C2_TOP + 48 + i * (F_CH + 3);
              const cx = fx + (C2_W - F_CW) / 2;
              return (
                <g key={i}>
                  <rect x={cx} y={cy} width={F_CW} height={F_CH} rx={4}
                    fill={C.white} stroke={C.elasticBlue} strokeWidth={1} />
                  <text x={cx + F_CW / 2} y={cy + F_CH / 2}
                    textAnchor="middle" dominantBaseline="central"
                    fontFamily={MONO} fontSize={13} fontWeight={700} fill={C.darkBlue}>
                    {v}
                  </text>
                </g>
              );
            })}
            <text x={fx + C2_W / 2} y={C2_TOP + C2_H - 8} textAnchor="middle"
              dominantBaseline="central" fontSize={8.5} fontStyle="italic" fill={C.darkBlue}>
              $Type$ArrayVector · values: $type$[]
            </text>
          </g>
        );
      })()}

      {/* ── Flavour B: ArrayBlock with nulls + multi-value ── */}
      {(() => {
        const fx = C2_X0 + C2_W + C2_GAP;
        const rows: { vals: string[]; isNull: boolean } [] = [
          { vals: ["42"],      isNull: false },
          { vals: [],          isNull: true  },
          { vals: ["7", "99"], isNull: false },
          { vals: ["13"],      isNull: false },
          { vals: [],          isNull: true  },
        ];
        return (
          <g>
            <rect x={fx} y={C2_TOP} width={C2_W} height={C2_H} rx={8}
              fill={TINT.semantic} stroke={C.teal} strokeWidth={1.5} />
            <text x={fx + C2_W / 2} y={C2_TOP + 18} textAnchor="middle"
              dominantBaseline="central" fontFamily={MONO} fontSize={10} fontWeight={700}
              fill={C.darkTeal}>
              ArrayBlock
            </text>
            <text x={fx + C2_W / 2} y={C2_TOP + 32} textAnchor="middle"
              dominantBaseline="central" fontSize={9} fill={C.darkTeal}>
              nullable · multi-valued positions
            </text>
            {rows.map((row, i) => {
              const cy = C2_TOP + 48 + i * (F_CH + 3);
              const cx = fx + (C2_W - F_CW) / 2;
              if (row.isNull) {
                return (
                  <g key={i}>
                    <rect x={cx} y={cy} width={F_CW} height={F_CH} rx={4}
                      fill="rgba(250,116,78,0.12)" stroke={C.poppy} strokeWidth={1}
                      strokeDasharray="4 2" />
                    <text x={cx + F_CW / 2} y={cy + F_CH / 2}
                      textAnchor="middle" dominantBaseline="central"
                      fontSize={12} fill={C.poppy}>
                      ∅ null
                    </text>
                  </g>
                );
              }
              if (row.vals.length > 1) {
                return (
                  <g key={i}>
                    <rect x={cx} y={cy} width={F_CW} height={F_CH} rx={4}
                      fill={C.white} stroke={C.teal} strokeWidth={1.5} />
                    <text x={cx + F_CW / 2} y={cy + F_CH / 2}
                      textAnchor="middle" dominantBaseline="central"
                      fontFamily={MONO} fontSize={11} fontWeight={700} fill={C.darkTeal}>
                      {row.vals.join(" · ")}
                    </text>
                    <rect x={cx + F_CW - 22} y={cy + 2} width={20} height={14} rx={3}
                      fill={C.teal} />
                    <text x={cx + F_CW - 12} y={cy + 9} textAnchor="middle"
                      dominantBaseline="central" fontSize={8} fontWeight={700} fill={C.white}>
                      ×{row.vals.length}
                    </text>
                  </g>
                );
              }
              return (
                <g key={i}>
                  <rect x={cx} y={cy} width={F_CW} height={F_CH} rx={4}
                    fill={C.white} stroke={C.teal} strokeWidth={1} />
                  <text x={cx + F_CW / 2} y={cy + F_CH / 2}
                    textAnchor="middle" dominantBaseline="central"
                    fontFamily={MONO} fontSize={13} fontWeight={700} fill={C.darkTeal}>
                    {row.vals[0]}
                  </text>
                </g>
              );
            })}
            <text x={fx + C2_W / 2} y={C2_TOP + C2_H - 8} textAnchor="middle"
              dominantBaseline="central" fontSize={8.5} fontStyle="italic" fill={C.darkTeal}>
              firstValueIndexes[] · BitSet nullsMask
            </text>
          </g>
        );
      })()}

      {/* ── Flavour C: Constant (RLE) ── */}
      {(() => {
        const fx = C2_X0 + 2 * (C2_W + C2_GAP);
        return (
          <g>
            <rect x={fx} y={C2_TOP} width={C2_W} height={C2_H} rx={8}
              fill="rgba(171,180,196,0.18)" stroke={C.mediumGray} strokeWidth={1.5} />
            <text x={fx + C2_W / 2} y={C2_TOP + 18} textAnchor="middle"
              dominantBaseline="central" fontFamily={MONO} fontSize={10} fontWeight={700}
              fill={C.ink}>
              Constant$Type$Vector
            </text>
            <text x={fx + C2_W / 2} y={C2_TOP + 32} textAnchor="middle"
              dominantBaseline="central" fontSize={9} fill={C.darkGray}>
              one value · O(1) memory
            </text>

            {/* single stored value */}
            <rect x={fx + C2_W / 2 - 32} y={C2_TOP + 48} width={64} height={32} rx={6}
              fill={C.white} stroke={C.ink} strokeWidth={2} />
            <text x={fx + C2_W / 2} y={C2_TOP + 64} textAnchor="middle"
              dominantBaseline="central" fontFamily={MONO} fontSize={16} fontWeight={700}
              fill={C.ink}>
              1.0
            </text>

            {/* arrow to many positions */}
            {[0,1,2,3,4].map(i => {
              const ty = C2_TOP + 100 + i * (F_CH + 3);
              const tx = fx + (C2_W - F_CW) / 2;
              return (
                <g key={i}>
                  <line x1={fx + C2_W / 2} y1={C2_TOP + 80}
                    x2={fx + C2_W / 2} y2={ty}
                    stroke={C.mediumGray} strokeWidth={1} strokeDasharray="3 2" />
                  <rect x={tx} y={ty} width={F_CW} height={F_CH - 4} rx={3}
                    fill="rgba(171,180,196,0.25)" stroke={C.mediumGray} strokeWidth={0.75} />
                  <text x={tx + F_CW / 2} y={ty + (F_CH - 4) / 2}
                    textAnchor="middle" dominantBaseline="central"
                    fontFamily={MONO} fontSize={11} fill={C.darkGray}>
                    1.0
                  </text>
                </g>
              );
            })}
            <text x={fx + C2_W / 2} y={C2_TOP + C2_H - 8} textAnchor="middle"
              dominantBaseline="central" fontSize={8.5} fontStyle="italic" fill={C.darkGray}>
              single field · repeated on read · RLE equivalent
            </text>
          </g>
        );
      })()}

      {/* ── Flavour D: Ordinal / dictionary ── */}
      {(() => {
        const fx = C2_X0 + 3 * (C2_W + C2_GAP);
        const ords = [0, 0, 1, 2, 1];
        const dict = ["nginx", "envoy", "redis"];
        const dictColors = [C.elasticBlue, C.teal, C.darkGray];
        const dictFills  = [TINT.physical, TINT.semantic, "rgba(171,180,196,0.25)"];
        return (
          <g>
            <rect x={fx} y={C2_TOP} width={C2_W} height={C2_H} rx={8}
              fill={TINT.physical} stroke={C.elasticBlue} strokeWidth={1.5} />
            <text x={fx + C2_W / 2} y={C2_TOP + 18} textAnchor="middle"
              dominantBaseline="central" fontFamily={MONO} fontSize={10} fontWeight={700}
              fill={C.darkBlue}>
              OrdinalBytesRefBlock
            </text>
            <text x={fx + C2_W / 2} y={C2_TOP + 32} textAnchor="middle"
              dominantBaseline="central" fontSize={9} fill={C.darkBlue}>
              ordinals → dictionary
            </text>

            {/* ordinal column */}
            {ords.map((ord, i) => {
              const cy = C2_TOP + 46 + i * (F_CH + 2);
              const ow = 28;
              const ox = fx + 12;
              const dw = 80;
              const dx = ox + ow + 8;
              return (
                <g key={i}>
                  {/* ordinal cell */}
                  <rect x={ox} y={cy} width={ow} height={F_CH} rx={3}
                    fill={dictFills[ord]} stroke={dictColors[ord]} strokeWidth={1} />
                  <text x={ox + ow / 2} y={cy + F_CH / 2}
                    textAnchor="middle" dominantBaseline="central"
                    fontFamily={MONO} fontSize={12} fontWeight={700}
                    fill={dictColors[ord]}>
                    {ord}
                  </text>
                  {/* arrow */}
                  <line x1={ox + ow + 2} y1={cy + F_CH / 2}
                    x2={dx - 2} y2={cy + F_CH / 2}
                    stroke={dictColors[ord]} strokeWidth={1}
                    markerEnd={`url(#mk-${ord === 0 ? "blue" : ord === 1 ? "teal" : "gray"})`} />
                  {/* value cell */}
                  <rect x={dx} y={cy} width={dw} height={F_CH} rx={3}
                    fill={dictFills[ord]} stroke={dictColors[ord]} strokeWidth={1} />
                  <text x={dx + dw / 2} y={cy + F_CH / 2}
                    textAnchor="middle" dominantBaseline="central"
                    fontFamily={MONO} fontSize={10} fontWeight={600}
                    fill={dictColors[ord]}>
                    {dict[ord]}
                  </text>
                </g>
              );
            })}
            <text x={fx + C2_W / 2} y={C2_TOP + C2_H - 8} textAnchor="middle"
              dominantBaseline="central" fontSize={8.5} fontStyle="italic" fill={C.darkBlue}>
              IntBlock ordinals + BytesRefVector bytes
            </text>
          </g>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════
          CONCEPT 3 — position vs value
      ══════════════════════════════════════════════════════════════ */}
      <ConceptLabel x={P_X0} y={C3_TOP - 20} num="3" text="One position can hold multiple values — or be null" />

      {POSITIONS.map((pos, pi) => {
        const px = P_X0 + pi * (P_W + P_GAP);
        const isNull = pos.isNull;
        const isMV   = pos.vals.length > 1;
        const fill   = isNull ? "rgba(250,116,78,0.09)" : isMV ? TINT.semantic : TINT.physical;
        const stroke = isNull ? C.poppy : isMV ? C.teal : C.elasticBlue;
        const color  = isNull ? C.darkPoppy : isMV ? C.darkTeal : C.darkBlue;

        // expand height for MV
        const slotH = isNull ? P_H : pos.vals.length * P_H + (pos.vals.length - 1) * 4;

        return (
          <g key={pi}>
            {/* position label */}
            <text x={px + P_W / 2} y={C3_TOP + 10} textAnchor="middle"
              dominantBaseline="central" fontSize={9} fill={C.darkGray} fontFamily={MONO}>
              pos {pi}
            </text>

            {/* outer position boundary */}
            <rect x={px} y={C3_TOP + 18} width={P_W} height={slotH + 8} rx={6}
              fill={fill} stroke={stroke} strokeWidth={isNull ? 1.5 : 2}
              strokeDasharray={isNull ? "5 3" : "none"} />

            {isNull ? (
              <text x={px + P_W / 2} y={C3_TOP + 18 + (slotH + 8) / 2}
                textAnchor="middle" dominantBaseline="central"
                fontSize={18} fill={C.poppy}>
                ∅
              </text>
            ) : (
              pos.vals.map((v, vi) => {
                const vy = C3_TOP + 22 + vi * (P_H + 4);
                return (
                  <g key={vi}>
                    <rect x={px + 4} y={vy} width={P_W - 8} height={P_H} rx={4}
                      fill={C.white} stroke={stroke} strokeWidth={1} />
                    <text x={px + P_W / 2} y={vy + P_H / 2}
                      textAnchor="middle" dominantBaseline="central"
                      fontFamily={MONO} fontSize={13} fontWeight={700} fill={color}>
                      {v}
                    </text>
                  </g>
                );
              })
            )}

            {/* annotation below */}
            <text x={px + P_W / 2} y={C3_TOP + 18 + slotH + 20}
              textAnchor="middle" dominantBaseline="central"
              fontSize={8.5} fontStyle="italic"
              fill={isNull ? C.poppy : isMV ? C.darkTeal : C.darkBlue}>
              {isNull ? "getValueCount = 0" : isMV ? `getValueCount = ${pos.vals.length}` : "single value"}
            </text>
          </g>
        );
      })}

      {/* legend — centered horizontal row below the positions */}
      {(() => {
        let cursor = LEG_X0;
        return LEG_ITEMS.map((l, i) => {
          const x = cursor;
          cursor += l.w;
          return (
            <g key={i}>
              <rect x={x} y={LEG_Y} width={14} height={14} rx={3}
                fill={l.fill} stroke={l.color} strokeWidth={1.5} />
              <text x={x + 20} y={LEG_Y + 7}
                dominantBaseline="central" fontSize={10} fill={C.ink}>
                {l.label}
              </text>
            </g>
          );
        });
      })()}
    </Figure>
  );
}
