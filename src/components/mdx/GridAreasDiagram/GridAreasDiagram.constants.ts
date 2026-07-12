// Base unit each column width is a multiple of, matching the `grid-template-columns: 1fr 2fr 2fr`.
export const UNIT = 68;

// Width of each of the 3 columns, in the 1:2:2 ratio.
export const COL_W = [UNIT, 2 * UNIT, 2 * UNIT];

// Height of each of the 3 rows: a short header, a tall middle row, a short footer.
export const ROW_H = [50, 140, 50];

// Gutter between adjacent columns and rows.
export const GAP = 12;

// Left x coordinate of the whole diagram.
export const ORIGIN_X = 40;

// Top y coordinate of the whole diagram.
export const ORIGIN_Y = 40;

// Left x coordinate of each of the 3 columns, derived from the widths and gap above.
export const COL_X = [ORIGIN_X, ORIGIN_X + COL_W[0] + GAP, ORIGIN_X + COL_W[0] + GAP + COL_W[1] + GAP];

// Top y coordinate of each of the 3 rows, derived from the heights and gap above.
export const ROW_Y = [ORIGIN_Y, ORIGIN_Y + ROW_H[0] + GAP, ORIGIN_Y + ROW_H[0] + GAP + ROW_H[1] + GAP];

// Total width spanned by all 3 columns together.
export const TOTAL_W = COL_X[2] + COL_W[2] - ORIGIN_X;
