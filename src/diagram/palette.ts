// Elastic brand palette — exact tokens from the brand reference.
// Used directly in SVG fill/stroke where Tailwind classes can't reach.
export const C = {
  sky: "#45a8ff",
  lightBlue: "#1893ff",
  elasticBlue: "#0b64dd",
  darkBlue: "#0a52b3",

  lightTeal: "#48efcf",
  teal: "#02bcb7",
  darkTeal: "#128d91",

  lightPoppy: "#ff957d",
  poppy: "#fa744e",
  darkPoppy: "#e55940",

  lightPink: "#f990c6",
  pink: "#f04e98",

  yellow: "#fec514",
  lightYellow: "#ffdf56",

  midnight: "#15338b",
  devBlue: "#101c3f",

  white: "#ffffff",
  lightGray: "#f5f7fa",
  mediumGray: "#dce2ea",
  darkGray: "#abb4c4",

  ink: "#343741",
  darkInk: "#1c1e23",
} as const;

// Very light semantic tints for highlighted nodes.
export const TINT = {
  physical: "rgba(11,100,221,0.06)", // ElasticBlue
  semantic: "rgba(2,188,183,0.08)", // Teal
  error: "rgba(250,116,78,0.07)", // Poppy
  muted: C.lightGray,
} as const;

export const FONT_SANS = "'Inter', ui-sans-serif, system-ui, sans-serif";
export const FONT_MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
