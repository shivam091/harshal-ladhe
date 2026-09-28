// Top-left corner of the enlarged marker grid, placed so the tick labels above and left of it stay inside the viewBox.
export const GRID_ORIGIN = { x: 40, y: 60 };

// Pixels per marker viewBox unit on the left panel — large enough that every one of the 10 grid cells is readable.
export const GRID_SCALE = 20;

// The marker's viewBox is 0 0 10 10, matching the arrowhead snippets used throughout the post.
export const GRID_UNITS = 10;

/*
  Pixels per marker unit on the right-hand comparison rows: 6 stroke-widths × 16px stroke ÷ 10 units. Derived from a
  real markerWidth="6" on a 16px stroke so the slivers poking out in the refX=10 row are the true size, not exaggerated.
*/
export const ROW_SCALE = 9.6;

// Stroke width of the comparison lines — thick enough that the butt-end corners are visibly wider than the tip.
export const ROW_STROKE = 16;

// Where every comparison line ends — the vertex the marker's (refX, refY) is aligned to.
export const VERTEX_X = 600;

// Where every comparison line begins, leaving a clear gap after the left panel's "tip" label.
export const LINE_START_X = 350;

/*
  The 2 comparison rows. Only refX differs, so the whole difference between them is where the tip lands relative to
  the vertex and whether the stroke's butt end is covered.
*/
export const ROWS = [
  { refX: 10, y: 100, title: "refX=\"10\": tip exactly on the vertex", note: "vertex · stroke corners poke out" },
  { refX: 8, y: 250, title: "refX=\"8\": line end tucked inside the arrow", note: "vertex · stroke end hidden" }
];
