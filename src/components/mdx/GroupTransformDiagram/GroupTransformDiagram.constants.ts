// Pixels per SVG user unit — the post's example uses a 100 × 100 viewBox, drawn here 3× so the rotated axes are legible.
export const SCALE = 3;

// Top-left of the drawn 100 × 100 canvas — the example's own (0, 0).
export const CANVAS = { x: 20, y: 20, size: 300 };

// The outer g's translate(50, 50) origin in diagram pixels — every other part of the illustration hangs off this point.
export const ORIGIN = { x: CANVAS.x + 50 * SCALE, y: CANVAS.y + 50 * SCALE };

// The inner g's rotation, in degrees — matches the post's rotate(20) so the diagram and markup agree exactly.
export const ROTATION_DEG = 20;

// Axis arrow lengths in pixels: outer axes long enough to clear the body, inner axes slightly shorter so their labels don't collide.
export const OUTER_AXIS_LENGTH = 120;
export const INNER_AXIS_LENGTH = 105;

/*
  Legend entries, top to bottom in the order the transforms are introduced. `kind` picks the swatch drawn beside each
  entry; the lines are pre-split because SVG text doesn't wrap and the right-hand column is narrow.
*/
export const LEGEND = [
  { y: 50, kind: "root", lines: ["svg user space", "origin at the viewBox's top-left, (0, 0)"] },
  { y: 110, kind: "outer", lines: ["outer g: translate(50, 50)", "moves the origin to the centre;", "body and head both draw from it"] },
  { y: 185, kind: "inner", lines: ["inner g: rotate(20)", "rotates the axes around that origin,", "so only the body tilts"] },
  { y: 260, kind: "head", lines: ["head circle, cy=\"-35\"", "lives in the outer g's frame,", "untouched by the body's rotation"] }
] as const;
