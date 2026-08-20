import { C, TINT } from "../palette"

export const RADIUS = 6
export const FRAME_RADIUS = 8
export const DASH = "3 4"
export const BLOCK_TYPE_SIZE = 10
export const BLOCK_FIELD_SIZE = 7.4
export const VALUE_SIZE = 9
export const TAG_SIZE = 7.6
export const STATE_FILL = TINT.value

export type Variant = "neutral" | "physical" | "semantic" | "muted" | "error" | "accent"

export const STROKE: Record<Variant, string> = {
  neutral: C.mediumGray,
  physical: C.blue,
  semantic: C.teal,
  muted: C.mediumGray,
  error: C.poppy,
  accent: C.pink,
}

export const FILL: Record<Variant, string> = {
  neutral: C.white,
  physical: TINT.physical,
  semantic: TINT.semantic,
  muted: TINT.muted,
  error: TINT.error,
  accent: C.white,
}

export const TEXT: Record<Variant, string> = {
  neutral: C.ink,
  physical: C.darkBlue,
  semantic: C.darkTeal,
  muted: C.mutedInk,
  error: C.darkPoppy,
  accent: C.pink,
}

export function fitMono(text: string, width: number, max = 10, min = 7.2) {
  return Math.max(min, Math.min(max, (width - 10) / (text.length * 0.58)))
}
