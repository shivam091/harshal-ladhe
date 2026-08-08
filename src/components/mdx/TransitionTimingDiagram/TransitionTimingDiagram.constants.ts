import type { TransitionTimingCurve, TransitionTimingCurveConfig } from "@/components/mdx/TransitionTimingDiagram/TransitionTimingDiagram.types";

// Left x coordinate of the plot area (its y-axis).
export const PLOT_LEFT = 70;

// Bottom y coordinate of the plot area (its x-axis, i.e. 0% progress).
export const PLOT_BOTTOM = 210;

// Width of the plot area, spanning the full 0s-to-1s time domain.
export const PLOT_W = 260;

// Height of the plot area, spanning the full 0%-to-100% progress domain.
export const PLOT_H = 170;

// Each keyword's real cubic-bezier control points, taken directly from the CSS spec, plus its display colour.
export const TIMING_CURVES: Record<TransitionTimingCurve, TransitionTimingCurveConfig> = {
  linear: { p1x: 0, p1y: 0, p2x: 1, p2y: 1, color: "var(--color-fg-muted)", dashed: true },
  ease: { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1, color: "var(--color-fg-accent)", dashed: false },
  "ease-in": { p1x: 0.42, p1y: 0, p2x: 1, p2y: 1, color: "var(--color-fg-attention)", dashed: false },
  "ease-out": { p1x: 0, p1y: 0, p2x: 0.58, p2y: 1, color: "var(--color-fg-success)", dashed: false },
  "ease-in-out": { p1x: 0.42, p1y: 0, p2x: 0.58, p2y: 1, color: "var(--color-fg-danger)", dashed: false }
};

// Display order for both the curves and the legend — deliberately not relying on object key order.
export const CURVE_ORDER: TransitionTimingCurve[] = ["linear", "ease", "ease-in", "ease-out", "ease-in-out"];

// x position of each legend entry's swatch, as two rows (3 then 2) left-aligned to the plot's left edge (PLOT_LEFT).
export const LEGEND_X = [70, 144, 206, 70, 156];

// y position of each legend entry's row.
export const LEGEND_Y = [262, 262, 262, 284, 284];
