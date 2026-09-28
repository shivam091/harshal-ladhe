// Shared vertical placement for every rect, so the two panels compare like for like.
export const ROW = { y: 70, height: 60 };

// Where each panel's measuring axis sits, just under the rects.
export const AXIS_Y = 150;

/*
  The objectBoundingBox panel: a small and a wide rect, each carrying its own 0 → 0.5 → 1 axis, because in
  this unit system every shape brings its own ruler.
*/
export const OBB_RECTS = [
  { x: 40, width: 80 },
  { x: 140, width: 150 }
];

/*
  The userSpaceOnUse panel: the same two sizes, with a single axis spanning x1=350 → x2=600 in user units —
  one ruler shared by both shapes, which is exactly why the ramp continues across the gap between them.
*/
export const UOU_RECTS = [
  { x: 350, width: 80 },
  { x: 450, width: 150 }
];

// The userSpaceOnUse gradient's x1/x2, matching the shared axis drawn under the right-hand panel.
export const UOU_VECTOR = { x1: 350, x2: 600 };

// The three tick positions on the shared user-space axis, labelled in raw user units.
export const UOU_TICKS = [350, 475, 600];

// The three tick labels every objectBoundingBox axis repeats — fractions of that shape's own box.
export const OBB_TICK_LABELS = ["0", "0.5", "1"];
