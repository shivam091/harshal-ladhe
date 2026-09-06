// Left x coordinate of the plot area (its y-axis).
export const PLOT_LEFT = 60;

// Bottom y coordinate of the plot area (its x-axis, i.e. lowest relative cost).
export const PLOT_BOTTOM = 230;

// Width of the plot area, spanning the full object-count domain.
export const PLOT_W = 280;

// Height of the plot area, spanning the full relative-cost domain.
export const PLOT_H = 170;

/*
  Evenly spaced x-axis ticks labeled with object counts. The spacing is NOT a real logarithmic scale — this
  whole chart is a conceptual illustration of a trend (see the in-diagram disclaimer text), not measured
  benchmark data, so ticks are laid out for legibility rather than mathematical accuracy.
*/
export const COUNT_TICKS = [
  { x: PLOT_LEFT, label: "10" },
  { x: PLOT_LEFT + PLOT_W / 3, label: "100" },
  { x: PLOT_LEFT + (PLOT_W / 3) * 2, label: "1,000" },
  { x: PLOT_LEFT + PLOT_W, label: "10,000+" }
];

/*
  Illustrative (not measured) relative per-frame cost at each tick above. SVG's line climbs because every
  extra shape is another real DOM node carrying its own style resolution, layout participation, and paint
  cost — the browser's DOM/CSS machinery was never built to stay flat past a few thousand live nodes.
*/
export const SVG_COST_Y = [PLOT_BOTTOM - 8, PLOT_BOTTOM - 42, PLOT_BOTTOM - 112, PLOT_BOTTOM - 166];

/*
  Illustrative (not measured) relative per-frame cost for Canvas at the same ticks. Canvas keeps no per-object
  bookkeeping at all — one draw call for 10 circles and one draw call (in a loop) for 10,000 cost roughly the
  same per pixel painted, so the line stays close to flat.
*/
export const CANVAS_COST_Y = [PLOT_BOTTOM - 6, PLOT_BOTTOM - 11, PLOT_BOTTOM - 18, PLOT_BOTTOM - 27];
