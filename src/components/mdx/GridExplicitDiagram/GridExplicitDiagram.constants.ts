// Size of every cell in the 2x2 grid, matching the `grid-template-columns: 1fr 1fr` / `grid-template-rows: 100px 100px`.
export const CELL = 100;

// Gutter between adjacent cells, both across columns and down rows.
export const GAP = 12;

// Top-left origin of the first cell.
export const ORIGIN = 20;

// Left/top coordinate of each of the 2 columns/rows.
export const TRACK = [ORIGIN, ORIGIN + CELL + GAP];
