// Size of every cell in the 3x3 grid, matching the post's own example.
export const CELL = 90;

// Gutter between adjacent cells, both across columns and down rows.
export const GAP = 14;

// Top-left origin of the first cell.
export const ORIGIN = 48;

// Shared column/row origins, since this grid is square.
export const TRACK = [ORIGIN, ORIGIN + CELL + GAP, ORIGIN + 2 * (CELL + GAP)];

// Grid line positions — outer edges plus the midpoint of each interior gutter, same convention as GridAnatomyDiagram.
export const LINES = [TRACK[0], TRACK[0] + CELL + GAP / 2, TRACK[1] + CELL + GAP / 2, TRACK[2] + CELL];

// Container padding around the outermost cell edges.
export const PAD = 14;

// Left/top coordinate of the outer container box (square, so shared by both axes).
export const CONTAINER_X = TRACK[0] - PAD;

// Width/height of the outer container box (square, so shared by both axes).
export const CONTAINER_SIZE = LINES[3] - TRACK[0] + 2 * PAD;
