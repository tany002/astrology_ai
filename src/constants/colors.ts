// Brand color tokens — matches UI_DESIGN_SYSTEM.md exactly
export const COLORS = {
  bg: "#090B16",
  surface: "#11152A",
  card: "#171C33",
  border: "#2D355A",
  text: "#FFFFFF",
  muted: "#A5A8C3",
  gold: "#D4AF37",
  goldDim: "#B8952E",
  purple: "#6E5BFF",
  success: "#35D07F",
  danger: "#FF6B6B",
} as const;

// Spacing scale — matches UI_DESIGN_SYSTEM.md
export const SPACING = [4, 8, 12, 16, 24, 32, 48, 64, 96] as const;

// Animation durations — matches UI_DESIGN_SYSTEM.md
export const MOTION = {
  fade: 0.3,
  slide: 0.4,
  scale: 0.25,
  hover: 0.15,
} as const;
