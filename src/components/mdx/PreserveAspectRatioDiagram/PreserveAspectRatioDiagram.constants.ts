// Every target box is square, so a wide source is guaranteed to mismatch it — the mismatch is what the diagram teaches.
export const TILE_SIZE = 44;

// Gap between tiles, wide enough that neighbouring letterbox frames never visually merge.
export const TILE_GAP = 10;

// Top of the first tile row, leaving room above for panel titles and the xMin/xMid/xMax column labels.
export const GRID_TOP = 52;

/*
  The source artwork's own viewBox — a 2:1 landscape shape, drawn as three equal colour bands so it's obvious at a
  glance which third survives a slice crop and where a meet letterbox puts the empty bars.
*/
export const SOURCE_VIEWBOX = "0 0 60 30";

// The three bands of the source artwork, left to right — distinct theme colours so each third stays identifiable once cropped.
export const SOURCE_BANDS = [
  { x: 0, fill: "var(--color-border-success-emphasis)" },
  { x: 20, fill: "var(--color-border-accent-emphasis)" },
  { x: 40, fill: "var(--color-border-attention-emphasis)" }
];

// Horizontal alignment keywords, in grid-column order.
export const X_ALIGNS = ["xMin", "xMid", "xMax"];

// Vertical alignment keywords, in grid-row order.
export const Y_ALIGNS = ["yMin", "yMid", "yMax"];

/*
  The two 3×3 panels. Both use the same nine alignment values so the only difference between them is the
  meet/slice keyword — each paired with the object-fit value it behaves like, since that's the mental model most
  readers already have.
*/
export const PANELS = [
  { mode: "meet", title: "meet (default)", caption: "≈ object-fit: contain", x: 76 },
  { mode: "slice", title: "slice", caption: "≈ object-fit: cover", x: 318 }
];

// The right-hand column: the untouched source for reference, then the single "none" tile that ignores alignment entirely.
export const SOURCE_THUMB = { x: 538, y: 52, width: 88, height: 44 };

// Position of the lone preserveAspectRatio="none" tile, bottom-aligned with the grids so all three captions share a baseline.
export const NONE_TILE = { x: 560, y: 160 };
