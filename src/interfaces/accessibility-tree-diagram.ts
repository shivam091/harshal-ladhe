import type { AccessibilityTreeDiagramVariant } from "@/types/accessibility-tree-diagram";

// Props for AccessibilityTreeDiagram — selects which markup-quality config to render.
export interface AccessibilityTreeDiagramProps {
  // Which of the two configs (semantic markup vs. div soup) to render.
  variant: AccessibilityTreeDiagramVariant;
}

// One DOM element rendered in the left column, written the way an author actually would.
export interface DomNodeConfig {
  // The opening tag (plus any relevant attribute), shown as the box's first line, e.g. `<button aria-label="Close">`.
  markup: string;
  // The element's visible text/icon content, shown as the box's second line.
  text: string;
}

// The accessibility-tree node (or lack of one) that the DOM element above actually produces.
export interface AccessibilityNodeConfig {
  // Exposed role, or null when the element exposes no role at all (e.g. a bare div).
  role: string | null;
  // Exposed accessible name, or null when the element exposes no name at all.
  name: string | null;
  // Whether assistive tech gets anything usable from this node — drives the box/connector color and content.
  accessible: boolean;
}

// One row pairing a DOM element with the accessibility-tree node it does (or doesn't) produce.
export interface AccessibilityTreeRow {
  dom: DomNodeConfig;
  node: AccessibilityNodeConfig;
}

// One variant's full diagram config: heading labels plus every row to render, top to bottom.
export interface AccessibilityTreeDiagramConfig {
  // Accessible label describing what this variant demonstrates.
  ariaLabel: string;
  // Heading shown above the DOM column, e.g. "Semantic markup" or "div / span soup" — the accessibility-tree column's heading is fixed across variants.
  domHeading: string;
  // Rows to render, top to bottom.
  rows: AccessibilityTreeRow[];
}
