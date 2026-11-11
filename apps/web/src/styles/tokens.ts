/**
 * A1 Chicken Center - Design System Tokens
 * Source of truth for styling, theme values, colors, typography and breakpoints.
 */

export const colors = {
  black: {
    deep: "#08080A",
    surface: "#121215",
    border: "#242429",
    muted: "#8E8E93",
  },
  white: {
    pure: "#FFFFFF",
    off: "#F4F4F6",
  },
  brand: {
    primary: "#DC2626", // Red-600
    crimson: "#991B1B", // Red-800
    dark: "#7F1D1D",    // Red-900
    deepest: "#450A0A", // Red-950
    light: "#EF4444",   // Red-500
  },
  status: {
    success: "#16A34A",
    warning: "#D97706",
    danger: "#DC2626",
  },
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const typography = {
  fontSans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
} as const;
