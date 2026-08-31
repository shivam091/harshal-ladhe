import type { GridItemAlignmentVariant } from "@/types/grid-item-alignment-diagram";

// Props for GridItemAlignmentDiagram — selects which self-alignment rule to illustrate.
export interface GridItemAlignmentDiagramProps {
  // Which item-level alignment rule to render: "top-right" (justify-self: end; align-self: start) or
  // "bottom-left" (place-self: end start).
  variant: GridItemAlignmentVariant;
}

// One alignment variant's marker offset (within the cell) plus the caption describing the CSS that produces it.
export interface GridItemAlignmentConfig {
  // Horizontal offset of the item marker from the cell's left edge.
  offsetX: number;
  // Vertical offset of the item marker from the cell's top edge.
  offsetY: number;
  // Caption text spelling out the CSS declaration this variant illustrates.
  caption: string;
}
