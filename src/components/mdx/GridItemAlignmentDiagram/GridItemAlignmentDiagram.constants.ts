import type { GridItemAlignmentVariant, GridItemAlignmentConfig } from "@/components/mdx/GridItemAlignmentDiagram/GridItemAlignmentDiagram.types";

// Left x coordinate of the single grid cell, matching the post's own "Visual Reference" ASCII art it replaces.
export const CELL_X = 40;

// Top y coordinate of the single grid cell.
export const CELL_Y = 20;

// Width of the single grid cell.
export const CELL_W = 180;

// Height of the single grid cell.
export const CELL_H = 130;

// Size of the small "[ ]" square standing in for the aligned item.
export const MARKER_SIZE = 26;

// Distance the marker sits from whichever cell edges it's aligned to.
const MARKER_MARGIN = 10;

// Per-variant marker offset (within the cell) and caption, one entry per self-alignment rule this post covers.
export const ITEM_ALIGNMENT_CONFIG: Record<GridItemAlignmentVariant, GridItemAlignmentConfig> = {
  "top-right": {
    offsetX: CELL_W - MARKER_SIZE - MARKER_MARGIN,
    offsetY: MARKER_MARGIN,
    caption: "justify-self: end; align-self: start;"
  },
  "bottom-left": {
    offsetX: MARKER_MARGIN,
    offsetY: CELL_H - MARKER_SIZE - MARKER_MARGIN,
    caption: "place-self: end start;"
  }
};
