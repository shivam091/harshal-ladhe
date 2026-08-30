import type { AxisDiagramVariant, AxisDiagramConfig } from "@/components/mdx/AxisDiagram/AxisDiagram.types";

// Horizontal centre of the diagram box, shared by both arrows and the legend.
export const CX = 240;

// Vertical centre of the diagram box, used as the horizontal arrow's y position.
export const CY = 120;

// Top y coordinate of the vertical (block) arrow.
export const VERTICAL_ARROW_TOP = 68;

// Bottom y coordinate of the vertical (block) arrow.
export const VERTICAL_ARROW_BOTTOM = 158;

// Left x coordinate of the horizontal (inline) arrow.
export const HORIZONTAL_ARROW_START = 155;

// Right x coordinate of the horizontal (inline) arrow.
export const HORIZONTAL_ARROW_END = 325;

// Vertical position shared by both legend rows.
export const LEGEND_Y = 250;

// Width reserved per legend item (swatch + label) — wide enough for either label without measuring text.
export const LEGEND_ITEM_WIDTH = 120;

// Horizontal gap between the two legend items.
export const LEGEND_GAP = 20;

// x position of the "inline axis" legend item, placed so both items sit symmetrically about CX.
export const LEGEND_INLINE_X = CX - LEGEND_ITEM_WIDTH - LEGEND_GAP / 2;

// x position of the "block axis" legend item — mirrors LEGEND_INLINE_X across CX.
export const LEGEND_BLOCK_X = CX + LEGEND_GAP / 2;

// Per-variant diagram config — verified against the post's "Quick Reference" table, keep both in sync.
export const AXIS_DIAGRAM_CONFIG: Record<AxisDiagramVariant, AxisDiagramConfig> = {
  "horizontal-ltr": {
    ariaLabel: "Diagram of horizontal-tb writing mode in left-to-right direction: the inline axis runs left to right, and the block axis runs top to bottom.",
    top: { term: "block-start", physical: "top", axis: "block" },
    bottom: { term: "block-end", physical: "bottom", axis: "block" },
    left: { term: "inline-start", physical: "left", axis: "inline" },
    right: { term: "inline-end", physical: "right", axis: "inline" },
    horizontalAxis: "inline",
    horizontalDirection: "start-to-end"
  },
  "horizontal-rtl": {
    ariaLabel: "Diagram of horizontal-tb writing mode in right-to-left direction: the inline axis runs right to left, and the block axis runs top to bottom.",
    top: { term: "block-start", physical: "top", axis: "block" },
    bottom: { term: "block-end", physical: "bottom", axis: "block" },
    left: { term: "inline-end", physical: "left", axis: "inline" },
    right: { term: "inline-start", physical: "right", axis: "inline" },
    horizontalAxis: "inline",
    horizontalDirection: "end-to-start"
  },
  "vertical-rl": {
    ariaLabel: "Diagram of vertical-rl writing mode: the inline axis runs top to bottom, and the block axis runs right to left.",
    top: { term: "inline-start", physical: "top", axis: "inline" },
    bottom: { term: "inline-end", physical: "bottom", axis: "inline" },
    left: { term: "block-end", physical: "left", axis: "block" },
    right: { term: "block-start", physical: "right", axis: "block" },
    horizontalAxis: "block",
    horizontalDirection: "end-to-start"
  },
  "vertical-lr": {
    ariaLabel: "Diagram of vertical-lr writing mode: the inline axis runs top to bottom, and the block axis runs left to right.",
    top: { term: "inline-start", physical: "top", axis: "inline" },
    bottom: { term: "inline-end", physical: "bottom", axis: "inline" },
    left: { term: "block-start", physical: "left", axis: "block" },
    right: { term: "block-end", physical: "right", axis: "block" },
    horizontalAxis: "block",
    horizontalDirection: "start-to-end"
  }
};
