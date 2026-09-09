import { BOX_HEIGHT, FIRST_ROW_Y, ROW_GAP, BOTTOM_MARGIN } from "@/components/mdx/AccessibilityTreeDiagram/AccessibilityTreeDiagram.constants";

// Returns the top y coordinate of the row at `index` (0-based) — every row shares the same height/gap.
export function rowTopY(index: number): number {
  return FIRST_ROW_Y + index * (BOX_HEIGHT + ROW_GAP);
}

// Returns the vertical center y of the row at `index` — used to anchor its connector line.
export function rowCenterY(index: number): number {
  return rowTopY(index) + BOX_HEIGHT / 2;
}

// Total SVG viewBox height needed to fit `rowCount` rows plus the column headings and a bottom margin.
export function diagramHeight(rowCount: number): number {
  return rowTopY(rowCount - 1) + BOX_HEIGHT + BOTTOM_MARGIN;
}
