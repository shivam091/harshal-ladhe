// Grid origin and cell size — cells are wider than tall so decimal values like 0.7152 would still fit if swapped in.
export const GRID = { x: 150, y: 76, cellWidth: 80, cellHeight: 40 };

// Input columns in the order `values` lists them; the fifth is the constant that is added, not multiplied.
export const COLUMNS = ["R", "G", "B", "A", "offset"];

// Output rows — primed, because each row computes a new channel rather than naming an input.
export const ROWS = ["R′", "G′", "B′", "A′"];

/*
  The identity matrix, row by row. Shown instead of an effect matrix because "1 on the diagonal, 0 elsewhere"
  is the baseline every other matrix is a deviation from.
*/
export const IDENTITY = [
  [1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0]
];
