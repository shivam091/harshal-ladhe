// The painted shape — wide and short on purpose, so the diagonal vector clearly isn't just "left to right".
export const SHAPE = { x: 60, y: 40, width: 340, height: 200 };

/*
  The gradient vector's endpoints in user space. Deliberately not corner-to-corner, so the flat "pad" areas
  beyond each end stay visible instead of vanishing into the shape's corners.
*/
export const VECTOR = { x1: 120, y1: 100, x2: 340, y2: 180 };

/*
  One isoline per stop: the line through each stop's point on the vector, perpendicular to it, pre-clipped to
  the shape's top and bottom edges (the vector direction is (220, 80), so the perpendicular is (-80, 220)).
  Pre-computed rather than derived at render time so the geometry is auditable against the prose.
*/
export const ISOLINES = [
  { label: "offset 0", top: { x: 141.8, y: 40 }, bottom: { x: 69.1, y: 240 } },
  { label: "offset 0.5", top: { x: 266.4, y: 40 }, bottom: { x: 193.6, y: 240 } },
  { label: "offset 1", top: { x: 390.9, y: 40 }, bottom: { x: 318.2, y: 240 } }
];

// Midpoint of the vector — where the 0.5 stop sits, marked so the stop-on-vector idea is literal.
export const MID_STOP = { x: 230, y: 140 };

/*
  Arrow shaft end: pulled back 5 units from (x2, y2) along the vector's unit direction (0.9398, 0.3417) so the
  arrowhead's tip meets the endpoint dot's edge instead of burying itself under it.
*/
export const ARROW_END = { x: 335.3, y: 178.3 };

// Right-hand legend rows — `bold` rows are headings, the rest are the plain-language explanation beneath each.
export const LEGEND = [
  { text: "Gradient vector", y: 70, bold: true },
  { text: "x1,y1 → x2,y2 sets both", y: 88, bold: false },
  { text: "direction and length", y: 104, bold: false },
  { text: "Dashed lines", y: 138, bold: true },
  { text: "a stop's color is constant", y: 156, bold: false },
  { text: "along a line perpendicular", y: 172, bold: false },
  { text: "to the vector", y: 188, bold: false },
  { text: "Past either end", y: 222, bold: true },
  { text: "spreadMethod decides (pad)", y: 240, bold: false }
];
