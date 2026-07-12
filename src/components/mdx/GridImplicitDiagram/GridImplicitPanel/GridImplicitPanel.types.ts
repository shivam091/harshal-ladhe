import type { GridImplicitCell } from "@/components/mdx/GridImplicitDiagram/GridImplicitDiagram.types";

// Props for GridImplicitPanel — renders one panel (explicit or implicit) at a given origin.
export interface GridImplicitPanelProps {
  // Left x coordinate the panel's cells are positioned relative to.
  originX: number;
  // Top y coordinate the panel's cells are positioned relative to.
  originY: number;
  // The cells to render in this panel.
  cells: GridImplicitCell[];
}
