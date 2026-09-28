// Every operator gets the same cell size so the six results can be compared shape-for-shape at a glance.
export const CELL = { width: 206, height: 214, radius: 10 };

// Top-left corner of each cell, in reading order — 3 columns × 2 rows fits the 660-wide canvas with even gutters.
export const CELL_ORIGINS = [
  { x: 12, y: 10 },
  { x: 227, y: 10 },
  { x: 442, y: 10 },
  { x: 12, y: 234 },
  { x: 227, y: 234 },
  { x: 442, y: 234 }
];

// Vertical offset of the drawing inside a cell, leaving room for the operator name above it.
export const DRAWING_OFFSET_Y = 34;

/*
  Input A (feComposite's `in`), in drawing-local coordinates. A square rather than a second circle so A and B
  stay distinguishable even when an operator shows only one of them.
*/
export const SQUARE_A = { x: 33, y: 10, size: 80 };

// Input B (`in2`), positioned so roughly a third of the square overlaps it — enough overlap to read every operator.
export const CIRCLE_B = { cx: 123, cy: 85, r: 45 };

// Operator key used to pick the drawing branch in the component.
export type CompositeOperator = "over" | "in" | "out" | "atop" | "xor" | "arithmetic";

/*
  The six operators in the order the post introduces them. Formulas use premultiplied colour (A, B) and
  alpha (αA, αB), which is how the spec defines them — the premultiplied form is why they are so short.
*/
export const OPERATORS: { operator: CompositeOperator; title: string; formula: string }[] = [
  { operator: "over", title: "over (default)", formula: "A + B·(1 − αA)" },
  { operator: "in", title: "in", formula: "A·αB" },
  { operator: "out", title: "out", formula: "A·(1 − αB)" },
  { operator: "atop", title: "atop", formula: "A·αB + B·(1 − αA)" },
  { operator: "xor", title: "xor", formula: "A·(1 − αB) + B·(1 − αA)" },
  { operator: "arithmetic", title: "arithmetic (k2 = k3 = 1)", formula: "k1·A·B + k2·A + k3·B + k4" }
];
