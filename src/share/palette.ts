// Shared drawing tokens for SVG fill/stroke where Tailwind classes cannot reach.
export const C = {
  sky: "#45a8ff",
  lightBlue: "#1893ff",
  blue: "#0b64dd",
  elasticBlue: "#0b64dd",
  darkBlue: "#0a52b3",

  lightTeal: "#73d8d4",
  teal: "#089a96",
  darkTeal: "#087a78",

  lightPoppy: "#ff957d",
  poppy: "#fa744e",
  darkPoppy: "#e55940",

  lightPink: "#d98fac",
  pink: "#b94d76",

  yellow: "#fec514",
  lightYellow: "#ffdf56",

  midnight: "#15338b",
  devBlue: "#101c3f",

  white: "#ffffff",
  lightGray: "#f5f7fa",
  mediumGray: "#dce2ea",
  darkGray: "#abb4c4",
  mutedInk: "#7f8a9b",
  faintInk: "#9aa5b5",

  ink: "#343741",
  darkInk: "#1c1e23",
} as const

// Very light semantic tints for highlighted nodes.
export const TINT = {
  physical: "rgba(11,100,221,0.055)",
  semantic: "rgba(8,154,150,0.075)",
  value: "rgba(185,77,118,0.052)",
  error: "rgba(250,116,78,0.07)",
  focus: "rgba(250,116,78,0.055)",
  focusStrong: "rgba(250,116,78,0.18)",
  numericPanel: "rgba(8,154,150,0.035)",
  ordinalPanel: "rgba(245,247,250,0.82)",
  muted: C.lightGray,
} as const

export const FONT_SANS = "'Inter', ui-sans-serif, system-ui, sans-serif"
export const FONT_MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
