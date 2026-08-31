import type { GridImplicitCell } from "@/interfaces/grid-implicit-diagram";

// Shared cell size for both panels — small enough that a 3-wide or 3-tall panel still fits comfortably.
export const CELL = 72;

// Gutter between adjacent cells, both across columns and down rows.
export const GAP = 10;

// Left x coordinate of the left (explicit) panel.
export const LEFT_X = 40;

// Top y coordinate of the left (explicit) panel.
export const LEFT_Y = 60;

// Left x coordinate of the right (implicit) panel — the left panel is always a plain 2x2, so this offset is fixed.
export const RIGHT_X = LEFT_X + 2 * CELL + GAP + 40;

// Top y coordinate of the right (implicit) panel, level with the left one.
export const RIGHT_Y = LEFT_Y;

// The 4 cells every "explicit" baseline grid has, before any implicit track is added.
export const BASELINE_CELLS: GridImplicitCell[] = [
  { col: 0, row: 0, label: "Item 1", isNew: false },
  { col: 1, row: 0, label: "Item 2", isNew: false },
  { col: 0, row: 1, label: "Item 3", isNew: false },
  { col: 1, row: 1, label: "Item 4", isNew: false }
];

// The extra cell(s) the browser generates once a 5th item overflows the explicit grid, one set per axis.
export const EXTRA_CELLS: Record<"rows" | "columns", GridImplicitCell[]> = {
  rows: [
    { col: 0, row: 2, label: "Item 5", isNew: true },
    { col: 1, row: 2, label: "—", isNew: true }
  ],
  columns: [
    { col: 2, row: 0, label: "Item 5", isNew: true },
    { col: 2, row: 1, label: "—", isNew: true }
  ]
};
