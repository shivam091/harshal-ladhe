// Monospace stack for coordinate labels, so they read as the same numbers you'd type into canvas code.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// Shrinks the 500 × 300 canvas so the axis labels still fit around it.
export const SCALE = 0.8;

// Leaves room to the left of the canvas for the y-axis label.
export const ORIGIN_X = 110;

// Leaves room above the canvas for the x-axis and origin labels.
export const ORIGIN_Y = 76;

// 500 px wide so the corner coordinates are round, easy-to-check numbers.
export const CANVAS_W = 500;

// 300 px tall so the corner coordinates are round, easy-to-check numbers.
export const CANVAS_H = 300;

// Fine enough to read positions off, coarse enough not to clutter the labels.
export const GRID_STEP = 50;

// Shows that fillRect()'s x and y are offsets from the top-left origin, not the centre.
export const EXAMPLE_RECT = { x: 50, y: 50, w: 150, h: 100 };

// The corners and centre are the points beginners most often get wrong once y runs downwards.
export const COORDINATE_POINTS = [
  { x: 0, y: 0, label: "(0, 0)", dx: -8, dy: -10, anchor: "end" },
  { x: 500, y: 0, label: "(500, 0)", dx: 0, dy: -12, anchor: "middle" },
  { x: 0, y: 300, label: "(0, 300)", dx: -8, dy: 20, anchor: "end" },
  { x: 500, y: 300, label: "(500, 300)", dx: 0, dy: 20, anchor: "end" },
  { x: 250, y: 150, label: "centre (250, 150)", dx: 10, dy: -8, anchor: "start" }
] as const;
