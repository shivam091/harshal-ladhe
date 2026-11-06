import type { TriggerCase } from "@/components/mdx/StartingStyleTriggerDiagram/StartingStyleTriggerDiagram.types";

// Cases where the element has never had a computed style before, so the starting style is used.
export const FIRES: TriggerCase[] = [
  { label: "Inserted into the DOM", hint: "appendChild, a framework render" },
  { label: "display: none → rendered", hint: "class toggle, [open], popover" },
  { label: "content-visibility reveal", hint: "hidden → visible" },
  { label: "First paint of the page", hint: "elements in the initial HTML" },
];

// Cases that look like an entrance but happen to an element that already has a style, so nothing is applied.
export const DOES_NOT_FIRE: TriggerCase[] = [
  { label: "Class added to a live node", hint: "it already has a first style" },
  { label: "Component re-render", hint: "same DOM node, no new style" },
  { label: "Keyed list reorder", hint: "nodes move, none are new" },
  { label: "Hover or state change", hint: "an ordinary transition instead" },
];

// Left edge of each column, chosen so the two columns share one gutter and the SVG stays centred.
export const COLUMN_X = [20, 215];

// Width of each column's cards.
export const COLUMN_W = 185;

// Top of the first card, leaving room for the column heading above it.
export const FIRST_ROW_Y = 44;

// Height of each card, enough for a label line and a hint line without crowding.
export const ROW_H = 44;

// Vertical gap between cards, so adjacent outlines read as separate cases.
export const ROW_GAP = 8;
