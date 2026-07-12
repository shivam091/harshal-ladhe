// Width of every cell in the 3-column x 2-row layout.
export const CELL_W = 96;

// Height of every cell in the 3-column x 2-row layout.
export const CELL_H = 84;

// Gutter between adjacent cells, both across columns and down rows.
export const GAP = 16;

// Left x coordinate of each of the 3 columns.
export const COL_X = [60, 60 + CELL_W + GAP, 60 + 2 * (CELL_W + GAP)];

// Top y coordinate of each of the 2 rows.
export const ROW_Y = [86, 86 + CELL_H + GAP];

/*
  Column grid line x positions: outer edges sit on the container border, interior lines sit at the midpoint of
  their gutter.
*/
export const COL_LINES = [COL_X[0], COL_X[0] + CELL_W + GAP / 2, COL_X[1] + CELL_W + GAP / 2, COL_X[2] + CELL_W];

// Row grid line y positions, using the same midpoint-of-gutter convention as COL_LINES.
export const ROW_LINES = [ROW_Y[0], ROW_Y[0] + CELL_H + GAP / 2, ROW_Y[1] + CELL_H];

// Container box padding around the outermost cell edges.
export const PAD = 14;

// Left x coordinate of the outer container box.
export const CONTAINER_X = COL_X[0] - PAD;

// Top y coordinate of the outer container box.
export const CONTAINER_Y = ROW_Y[0] - PAD;

// Width of the outer container box.
export const CONTAINER_W = COL_LINES[3] - COL_X[0] + 2 * PAD;

// Height of the outer container box.
export const CONTAINER_H = ROW_LINES[2] - ROW_Y[0] + 2 * PAD;
