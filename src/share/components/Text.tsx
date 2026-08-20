import type { ReactNode } from "react"
import { C, FONT_MONO } from "../palette"
import { TAG_SIZE } from "./styles"

export function Annotation({
  x,
  y,
  children,
  anchor = "middle",
  color = C.darkGray,
  size = 12,
}: {
  x: number
  y: number
  children: ReactNode
  anchor?: "start" | "middle" | "end"
  color?: string
  size?: number
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
  )
}

export function GroupLabel({
  x,
  y,
  children,
  anchor = "start",
  color = C.ink,
}: {
  x: number
  y: number
  children: ReactNode
  anchor?: "start" | "middle" | "end"
  color?: string
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={13}
      fontWeight={820}
      letterSpacing={1.25}
      fill={color}
    >
      {children}
    </text>
  )
}

export function Label({
  x,
  y,
  children,
  anchor = "middle",
  color = C.ink,
  size = 13,
  weight = 500,
  mono,
}: {
  x: number
  y: number
  children: ReactNode
  anchor?: "start" | "middle" | "end"
  color?: string
  size?: number
  weight?: number
  mono?: boolean
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
  )
}

export function SectionTitle({
  x,
  y,
  children,
  color = C.faintInk,
  size = 7.4,
  anchor = "middle",
}: {
  x: number
  y: number
  children: ReactNode
  color?: string
  size?: number
  anchor?: "start" | "middle" | "end"
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fontFamily={FONT_MONO}
      fontSize={size}
      fontWeight={760}
      letterSpacing={1}
      fill={color}
    >
      {children}
    </text>
  )
}

export function SmallTag({
  x,
  y,
  children,
  anchor = "start",
  opacity = 0.75,
  size = TAG_SIZE,
}: {
  x: number
  y: number
  children: ReactNode
  anchor?: "start" | "middle" | "end"
  opacity?: number
  size?: number
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fontFamily={FONT_MONO}
      fontSize={size}
      fontWeight={600}
      fill={C.darkGray}
      opacity={opacity}
    >
      {children}
    </text>
  )
}
