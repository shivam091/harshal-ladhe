import type { RadialGradientSizeBoundary } from "@/interfaces/radial-gradient-diagram";

// Start color of the demo gradient — matches the post's own Radial Gradient code example.
export const SWATCH_FROM = "#10b981";

// End color of the demo gradient — matches the post's own Radial Gradient code example.
export const SWATCH_TO = "#0ea5e9";

// Circle swatch: a square box, so the default circular gradient renders as a true circle. Same height as
// ELLIPSE_BOX below, so the two sit as a consistent, aligned pair — only the width differs.
export const CIRCLE_BOX = { x: 40, y: 20, size: 180 };

// Ellipse swatch: same height as CIRCLE_BOX, just wider — the *same* default gradient definition renders as
// an ellipse because objectBoundingBox space scales non-uniformly with the element's own width/height, no
// extra math needed.
export const ELLIPSE_BOX = { x: 260, y: 20, w: 220, h: 180 };

// Side length of the square "element box" the size-keyword boundaries are drawn inside.
export const SIZE_PANEL = 320;

/*
  Top-left corner of the size-keyword panel — positioned so the largest boundary (farthest-corner, 311px
  radius) fits entirely inside the canvas with no clipping, since every boundary circle is shown in full.
*/
export const SIZE_PANEL_ORIGIN = { x: 215, y: 235 };

/*
  The gradient's origin point is deliberately off-center (25% 30% of the panel) — the 4 size keywords only
  produce visibly different circles when the origin isn't dead-center, which is exactly the case beginners
  find confusing in real layouts.
*/
export const ORIGIN_LOCAL = { x: 110, y: 90 };

/*
  The 4 CSS radial-gradient size keywords, as boundary circles measured from ORIGIN_LOCAL against a 320x320
  box: closest-side/farthest-side measure to the nearest/farthest edge, closest-corner/farthest-corner measure
  to the nearest/farthest corner. Distinct colors AND dash patterns so the legend never relies on color alone.
*/
export const SIZE_BOUNDARIES: RadialGradientSizeBoundary[] = [
  {
    keyword: "closest-side",
    radius: 90,
    color: "var(--color-border-accent-emphasis)",
    dashArray: "0"
  },
  {
    keyword: "closest-corner",
    radius: 142,
    color: "var(--color-border-attention-emphasis)",
    dashArray: "6 4"
  },
  {
    keyword: "farthest-side",
    radius: 230,
    color: "var(--color-border-success-emphasis)",
    dashArray: "2 3"
  },
  {
    keyword: "farthest-corner",
    radius: 311,
    color: "var(--color-border-danger-emphasis)",
    dashArray: "10 4"
  }
];
