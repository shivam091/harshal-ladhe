// Center point of the clock-face circle.
export const CENTER = { x: 170, y: 160 };

// Radius of the circle itself.
export const RADIUS = 100;

/*
  Top-left corner and side length of the <foreignObject> that hosts the real `conic-gradient()` swatch —
  SVG has no native conic gradient primitive, so the swatch is genuine CSS rendered by the browser rather
  than a hand-approximated wedge fan, guaranteeing it's never subtly wrong.
*/
export const FOREIGN_OBJECT = { x: 70, y: 60, size: 200 };

// Radius of the guide arc that shows the clockwise sweep direction, drawn just outside the circle itself.
export const ARC_OUTER_RADIUS = 112;

// Start point of the sweep-direction arc, just outside the circle's 12 o'clock (0deg) position.
export const ARC_START = { x: CENTER.x, y: CENTER.y - ARC_OUTER_RADIUS };

/*
  End point of the sweep-direction arc — a short 40deg hint near the top rather than a full quarter-turn, so it
  stays clear of the 90deg tick label on the circle's right edge instead of colliding with it.
*/
export const ARC_END = {
  x: CENTER.x + ARC_OUTER_RADIUS * Math.sin((40 * Math.PI) / 180),
  y: CENTER.y - ARC_OUTER_RADIUS * Math.cos((40 * Math.PI) / 180)
};

/*
  The two colors of the demo sweep, matching the post's own Conic Gradient code example, looped back to the
  first color at 100% so the wheel reads as one continuous, seamless sweep instead of a visible seam.
*/
export const SWEEP_COLORS = "#8b5cf6, #f59e0b, #8b5cf6";
