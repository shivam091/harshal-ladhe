// Shared width of each of the 4 angle-swatch panels.
export const PANEL_W = 200;

// Shared height of each of the 4 angle-swatch panels.
export const PANEL_H = 110;

// Start color of the demo gradient in every panel — matches the post's own Linear Gradient code example.
export const SWATCH_FROM = "#fb923c";

// End color of the demo gradient in every panel — matches the post's own Linear Gradient code example.
export const SWATCH_TO = "#e11d48";

/*
  The 4 cardinal angles CSS `linear-gradient()` accepts, laid out clockwise from the top (0deg) the same way
  the angle itself increases — this is the one fact the whole diagram exists to teach: CSS gradient angles
  start pointing UP, not right, so 0deg is "to top" and the angle sweeps clockwise from there.
*/
export const GRADIENT_AXIS_PANELS = [
  {
    // Top-left panel — 0deg is straight up, the CSS default starting point.
    panelX: 20,
    panelY: 30,
    degree: "0deg",
    keyword: "to top",
    // objectBoundingBox coordinates for the SVG <linearGradient>: bottom (start color) to top (end color).
    x1: 0, y1: 1, x2: 0, y2: 0,
    // Arrow drawn bottom-to-top inside the panel, matching the gradient's own flow direction.
    arrowX1: 100, arrowY1: 95, arrowX2: 100, arrowY2: 15
  },
  {
    // Top-right panel — 90deg, a quarter-turn clockwise from 0deg.
    panelX: 260,
    panelY: 30,
    degree: "90deg",
    keyword: "to right",
    x1: 0, y1: 0, x2: 1, y2: 0,
    arrowX1: 15, arrowY1: 55, arrowX2: 185, arrowY2: 55
  },
  {
    // Bottom-right panel — 180deg, directly opposite 0deg.
    panelX: 260,
    panelY: 210,
    degree: "180deg",
    keyword: "to bottom",
    x1: 0, y1: 0, x2: 0, y2: 1,
    arrowX1: 100, arrowY1: 15, arrowX2: 100, arrowY2: 95
  },
  {
    // Bottom-left panel — 270deg, three-quarters of the way around from 0deg.
    panelX: 20,
    panelY: 210,
    degree: "270deg",
    keyword: "to left",
    x1: 1, y1: 0, x2: 0, y2: 0,
    arrowX1: 185, arrowY1: 55, arrowX2: 15, arrowY2: 55
  }
];
