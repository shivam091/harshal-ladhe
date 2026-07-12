import type { GridContainerAlignmentVariant, GridContainerAlignmentConfig } from "@/components/mdx/GridContainerAlignmentDiagram/GridContainerAlignmentDiagram.types";

// Width of every cell in the 3-column x 2-row layout.
export const CELL_W = 110;

// Height of every cell in the 3-column x 2-row layout.
export const CELL_H = 80;

// Gutter between adjacent cells, both across columns and down rows.
export const GAP = 12;

// Left x coordinate of the whole diagram.
export const ORIGIN_X = 30;

// Top y coordinate of the whole diagram.
export const ORIGIN_Y = 30;

// Left x coordinate of each of the 3 columns.
export const COL_X = [ORIGIN_X, ORIGIN_X + CELL_W + GAP, ORIGIN_X + 2 * (CELL_W + GAP)];

// Top y coordinate of each of the 2 rows.
export const ROW_Y = [ORIGIN_Y, ORIGIN_Y + CELL_H + GAP];

// Size of the small "[ ]" square standing in for a grid item.
export const MARKER_SIZE = 22;

// Container padding around the outermost cell edges.
export const PAD = 12;

// Left x coordinate of the outer container box.
export const CONTAINER_X = COL_X[0] - PAD;

// Top y coordinate of the outer container box.
export const CONTAINER_Y = ROW_Y[0] - PAD;

// Width of the outer container box.
export const CONTAINER_W = COL_X[2] + CELL_W - COL_X[0] + 2 * PAD;

// Height of the outer container box.
export const CONTAINER_H = ROW_Y[1] + CELL_H - ROW_Y[0] + 2 * PAD;

// Per-variant marker offset (within a cell) and caption, one entry per alignment rule this post covers.
export const CONTAINER_ALIGNMENT_CONFIG: Record<GridContainerAlignmentVariant, GridContainerAlignmentConfig> = {
  center: {
    offsetX: (CELL_W - MARKER_SIZE) / 2,
    offsetY: (CELL_H - MARKER_SIZE) / 2,
    caption: "justify-items: center; align-items: center;"
  },
  "end-start": {
    offsetX: 8,
    offsetY: CELL_H - MARKER_SIZE - 8,
    caption: "place-items: end start;"
  }
};
