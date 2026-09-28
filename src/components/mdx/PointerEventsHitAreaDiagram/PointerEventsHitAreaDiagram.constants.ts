/*
  The example ring: a circle whose stroke straddles its outline, half inside the fill and half outside it.
  Sized so the geometry bounding box's corners stay clear of the stroke's outer edge, keeping all three
  hit regions (fill, stroke band, bbox corners) visibly separate.
*/
export const RING = { cx: 170, cy: 180, r: 80, strokeWidth: 24 };

// Geometry bounding box of RING — excludes the stroke, which is exactly what getBBox() reports too.
export const BBOX = { x: RING.cx - RING.r, y: RING.cy - RING.r, width: RING.r * 2, height: RING.r * 2 };

// Legend swatches under the ring, naming each shaded region in the same colours as the matrix headers.
export const SWATCHES = [
  { x: 40, label: "fill region", fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" },
  { x: 150, label: "stroke band", fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" },
  { x: 265, label: "bbox", fill: "var(--color-bg-attention-muted)", stroke: "var(--color-border-attention-emphasis)" }
];

// Matrix columns: one per hit region, placed so the widest cell text ("if painted") never touches its neighbour.
export const COLUMNS = [
  { x: 505, label: "fill", fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" },
  { x: 578, label: "stroke", fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" },
  { x: 642, label: "bbox", fill: "var(--color-bg-attention-muted)", stroke: "var(--color-border-attention-emphasis)" }
];

// Left edge of the value-name column in the matrix.
export const VALUE_COLUMN_X = 340;

// Vertical position of the first matrix row and the spacing between rows.
export const FIRST_ROW_Y = 84;

// Row pitch keeps eight rows plus header inside the ring's height so the two halves line up.
export const ROW_PITCH = 26;

/*
  Which regions each pointer-events value makes hit-testable. "if painted" means that paint is not `none`;
  "yes" means regardless of paint. The visibility-dependent values (visiblePainted, visible) also require
  visibility: visible, which the footnote calls out rather than cluttering every cell.
*/
export const VALUES = [
  { name: "visiblePainted*", cells: ["if painted", "if painted", "—"] },
  { name: "visible", cells: ["yes", "yes", "—"] },
  { name: "painted", cells: ["if painted", "if painted", "—"] },
  { name: "fill", cells: ["yes", "—", "—"] },
  { name: "stroke", cells: ["—", "yes", "—"] },
  { name: "all", cells: ["yes", "yes", "—"] },
  { name: "none", cells: ["—", "—", "—"] },
  { name: "bounding-box", cells: ["—", "—", "yes"] }
];
