export const CHART_COLORS = {
  primary: "#fafafa",
  secondary: "rgba(250,250,250,0.6)",
  tertiary: "rgba(250,250,250,0.4)",
  quaternary: "rgba(250,250,250,0.25)",
  muted: "rgba(250,250,250,0.15)",
  grid: "rgba(255,255,255,0.04)",
  axis: "#71717a",
  tooltipBg: "#1c1c21",
  tooltipBorder: "rgba(255,255,255,0.07)",
} as const;

export const MONOCHROME_SERIES = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  CHART_COLORS.muted,
] as const;

export const CHART_ANIMATION = { isAnimationActive: false as const };
