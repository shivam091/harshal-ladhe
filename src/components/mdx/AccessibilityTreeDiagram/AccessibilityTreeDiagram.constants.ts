import type { AccessibilityTreeDiagramVariant } from "@/types/accessibility-tree-diagram";
import type { AccessibilityTreeDiagramConfig } from "@/interfaces/accessibility-tree-diagram";

// Left-column (DOM) box geometry, shared by every row in every variant.
export const DOM_BOX_X = 16;
export const DOM_BOX_WIDTH = 224;

// Right-column (accessibility-tree) box geometry, shared by every row in every variant.
export const TREE_BOX_X = 344;
export const TREE_BOX_WIDTH = 224;

// Box height and the vertical gap between successive rows — both columns share these.
export const BOX_HEIGHT = 72;
export const ROW_GAP = 24;

// y position of the first row, leaving room for the column headings rendered above it.
export const FIRST_ROW_Y = 46;

// Extra space left below the last row so its box/border isn't clipped by the viewBox edge.
export const BOTTOM_MARGIN = 20;

// x span the horizontal connector line travels between the two columns.
export const CONNECTOR_START_X = DOM_BOX_X + DOM_BOX_WIDTH;
export const CONNECTOR_END_X = TREE_BOX_X;

// y position of both column headings.
export const HEADING_Y = 20;

// Accessibility-tree column's heading — identical across variants; only the DOM side's heading changes.
export const TREE_HEADING = "Accessibility Tree";

/*
  Per-variant diagram config — one row per DOM element, compared against the accessibility-tree
  node (or lack of one) it produces. Kept in sync with whichever post section renders this
  diagram: "good" backs a <button aria-label> / <h3>-style example, "bad" backs the div-soup
  equivalent of the exact same UI.
*/
export const ACCESSIBILITY_TREE_DIAGRAM_CONFIG: Record<AccessibilityTreeDiagramVariant, AccessibilityTreeDiagramConfig> = {
  good: {
    ariaLabel: "Diagram of semantic markup and the accessibility tree it produces: an h3 heading exposes a heading node named New message, and a button with an aria-label exposes a button node named Close.",
    domHeading: "Semantic markup",
    rows: [
      {
        dom: { markup: "<h3>", text: "New message" },
        node: { role: "heading", name: '"New message"', accessible: true }
      },
      {
        dom: { markup: '<button aria-label="Close">', text: "×" },
        node: { role: "button", name: '"Close"', accessible: true }
      }
    ]
  },
  bad: {
    ariaLabel: "Diagram of div-based markup and the accessibility tree it produces: a div styled as a heading and a div with an onclick handler both expose no role and no accessible name, so assistive tech gets nothing usable from either.",
    domHeading: "div / span soup",
    rows: [
      {
        dom: { markup: '<div class="title">', text: "New message" },
        node: { role: null, name: null, accessible: false }
      },
      {
        dom: { markup: '<div onclick="...">', text: "×" },
        node: { role: null, name: null, accessible: false }
      }
    ]
  }
};
