export const colorValues = {
  blue: "#3b82f6",
  emerald: "#10b981",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  gray: "#6b7280",
  cyan: "#06b6d4",
  pink: "#ec4899",
  lime: "#84cc16",
  fuchsia: "#d946ef",
} as const;

export type Color = keyof typeof colorValues;

export const availableColors = Object.keys(colorValues) as Color[];

/** Tailwind fill classes for each color token (500 shade) */
export const colorFillClasses: Record<Color, string> = {
  blue: "fill-blue-500",
  emerald: "fill-emerald-500",
  violet: "fill-violet-500",
  amber: "fill-amber-500",
  gray: "fill-gray-500",
  cyan: "fill-cyan-500",
  pink: "fill-pink-500",
  lime: "fill-lime-500",
  fuchsia: "fill-fuchsia-500",
};

/** Tailwind stroke classes for each color token (500 shade) */
export const colorStrokeClasses: Record<Color, string> = {
  blue: "stroke-blue-500",
  emerald: "stroke-emerald-500",
  violet: "stroke-violet-500",
  amber: "stroke-amber-500",
  gray: "stroke-gray-500",
  cyan: "stroke-cyan-500",
  pink: "stroke-pink-500",
  lime: "stroke-lime-500",
  fuchsia: "stroke-fuchsia-500",
};

/** Tailwind background classes for legend squares */
export const colorBgClasses: Record<Color, string> = {
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  gray: "bg-gray-500",
  cyan: "bg-cyan-500",
  pink: "bg-pink-500",
  lime: "bg-lime-500",
  fuchsia: "bg-fuchsia-500",
};

/** Hex value lookup for inline SVG styles where Tailwind classes can't reach */
export function getColorValue(color: Color): string {
  return colorValues[color];
}
