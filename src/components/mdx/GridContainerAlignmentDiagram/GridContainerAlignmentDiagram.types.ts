// Props for GridContainerAlignmentDiagram — selects which alignment rule to illustrate.
export interface GridContainerAlignmentDiagramProps {
  // Which container-level alignment rule to render: "center" (justify-items/align-items: center) or
  // "end-start" (place-items: end start).
  variant: GridContainerAlignmentVariant;
}

// The two container-level alignment examples this post walks through.
export type GridContainerAlignmentVariant = "center" | "end-start";

// One alignment variant's marker offset (within a cell) plus the caption describing the CSS that produces it.
export interface GridContainerAlignmentConfig {
  // Horizontal offset of the item marker from the cell's left edge.
  offsetX: number;
  // Vertical offset of the item marker from the cell's top edge.
  offsetY: number;
  // Caption text spelling out the CSS declaration this variant illustrates.
  caption: string;
}
