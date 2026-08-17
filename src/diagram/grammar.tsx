import type { ReactNode } from "react";
import { C, TINT, FONT_MONO } from "./palette";

// ---------------------------------------------------------------------------
// A small, shared diagram grammar for the PromQL-in-Elasticsearch figures.
// Everything renders as SVG so each figure is self-contained and export-ready.
// Semantic color rules (stable across every figure):
//   ElasticBlue = physical Elasticsearch execution / data movement
//   Teal        = PromQL / Prometheus semantics
//   Ink         = neutral structure   Gray = de-emphasized   Poppy = a problem
// ---------------------------------------------------------------------------

export type Variant =
  | "neutral"
  | "physical"
  | "semantic"
  | "muted"
  | "error"
  | "accent";

const STROKE: Record<Variant, string> = {
  neutral: C.mediumGray,
  physical: C.elasticBlue,
  semantic: C.teal,
  muted: C.darkGray,
  error: C.poppy,
  accent: C.pink,
};
const FILL: Record<Variant, string> = {
  neutral: C.white,
  physical: TINT.physical,
  semantic: TINT.semantic,
  muted: TINT.muted,
  error: TINT.error,
  accent: C.white,
};
const TEXT: Record<Variant, string> = {
  neutral: C.ink,
  physical: C.darkBlue,
  semantic: C.darkTeal,
  muted: C.darkGray,
  error: C.darkPoppy,
  accent: C.pink,
};

// Arrow / connector markers. Rendered once per <svg> via <Markers/>.
export function Markers() {
  const head = (id: string, color: string) => (
    <marker
      id={id}
      key={id}
      viewBox="0 0 10 10"
      refX="8.5"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M0,0 L10,5 L0,10 z" fill={color} />
    </marker>
  );
  return (
    <defs>
      {head("mk-ink", C.ink)}
      {head("mk-blue", C.elasticBlue)}
      {head("mk-gray", C.darkGray)}
      {head("mk-teal", C.teal)}
    </defs>
  );
}

type NodeProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  sub?: string;
  variant?: Variant;
  mono?: boolean;
  dashed?: boolean;
  radius?: number;
};

export function Node({
  x,
  y,
  w,
  h,
  label,
  sub,
  variant = "neutral",
  mono,
  dashed,
  radius = 7,
}: NodeProps) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const labelY = sub ? cy - 6 : cy;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={radius}
        fill={FILL[variant]}
        stroke={STROKE[variant]}
        strokeWidth={variant === "neutral" || variant === "muted" ? 1 : 1.5}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      {label && (
        <text
          x={cx}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={13}
          fontWeight={600}
          fontFamily={mono ? FONT_MONO : undefined}
          fill={TEXT[variant]}
        >
          {label}
        </text>
      )}
      {sub && (
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={10.5}
          fill={C.darkGray}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

// A monospace code / label chip on a light-gray fill.
export function Chip({
  x,
  y,
  text,
  color = C.ink,
  size = 12,
  anchor = "middle",
  padX = 9,
  h = 22,
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
  padX?: number;
  h?: number;
}) {
  const w = text.length * size * 0.62 + padX * 2;
  const rx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  return (
    <g>
      <rect
        x={rx}
        y={y - h / 2}
        width={w}
        height={h}
        rx={5}
        fill={C.lightGray}
        stroke={C.mediumGray}
        strokeWidth={1}
      />
      <text
        x={rx + w / 2}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_MONO}
        fontSize={size}
        fill={color}
      >
        {text}
      </text>
    </g>
  );
}

type ArrowVariant = "logical" | "physical" | "muted" | "network" | "semantic";

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  variant = "logical",
  double,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  variant?: ArrowVariant;
  double?: boolean;
}) {
  const map = {
    logical: { color: C.ink, w: 1.25, marker: "mk-ink", dash: undefined },
    physical: { color: C.elasticBlue, w: 2, marker: "mk-blue", dash: undefined },
    muted: { color: C.darkGray, w: 1.1, marker: "mk-gray", dash: undefined },
    network: { color: C.elasticBlue, w: 1.5, marker: "mk-blue", dash: "5 4" },
    semantic: { color: C.teal, w: 1.5, marker: "mk-teal", dash: undefined },
  } as const;
  const s = map[variant];
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={s.color}
      strokeWidth={s.w}
      strokeDasharray={s.dash}
      markerEnd={`url(#${s.marker})`}
      markerStart={double ? `url(#${s.marker})` : undefined}
    />
  );
}

// A plain edge (no arrowhead) — for operator-tree branches.
export function Edge({
  x1,
  y1,
  x2,
  y2,
  color = C.darkGray,
  width = 1.25,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? "4 3" : undefined}
      strokeLinecap="round"
    />
  );
}

// A labeled boundary region (e.g. "PROMQL SEMANTICS").
export function Boundary({
  x,
  y,
  w,
  h,
  label,
  color = C.teal,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill="none"
        stroke={color}
        strokeWidth={1}
        strokeDasharray="2 4"
        opacity={0.8}
      />
      <text
        x={x + 12}
        y={y + 15}
        fontSize={10}
        fontWeight={600}
        letterSpacing={1.2}
        fill={color}
      >
        {label.toUpperCase()}
      </text>
    </g>
  );
}

// The distinctive network-exchange boundary.
export function ExchangeBoundary({
  x1,
  x2,
  y,
  label = "NETWORK EXCHANGE",
}: {
  x1: number;
  x2: number;
  y: number;
  label?: string;
}) {
  const mid = (x1 + x2) / 2;
  const lw = label.length * 6 + 24;
  return (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={C.elasticBlue}
        strokeWidth={1.25}
        strokeDasharray="6 5"
      />
      <rect
        x={mid - lw / 2}
        y={y - 11}
        width={lw}
        height={22}
        rx={11}
        fill={C.white}
        stroke={C.elasticBlue}
        strokeWidth={1}
      />
      <text
        x={mid}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontWeight={600}
        letterSpacing={1}
        fill={C.elasticBlue}
      >
        {label}
      </text>
    </g>
  );
}

export function Annotation({
  x,
  y,
  children,
  anchor = "middle",
  color = C.darkGray,
  size = 11,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  color?: string;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontStyle="italic"
      fill={color}
    >
      {children}
    </text>
  );
}

// Small eyebrow labels above a region ("DATA NODES", "COORDINATOR", …).
export function GroupLabel({
  x,
  y,
  children,
  anchor = "start",
  color = C.darkGray,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  color?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={10}
      fontWeight={600}
      letterSpacing={1.4}
      fill={color}
    >
      {children}
    </text>
  );
}

export function Label({
  x,
  y,
  children,
  anchor = "middle",
  color = C.ink,
  size = 12,
  weight = 500,
  mono,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  color?: string;
  size?: number;
  weight?: number;
  mono?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fontSize={size}
      fontWeight={weight}
      fontFamily={mono ? FONT_MONO : undefined}
      fill={color}
    >
      {children}
    </text>
  );
}
