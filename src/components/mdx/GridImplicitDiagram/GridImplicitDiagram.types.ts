// Props for GridImplicitDiagram — selects which axis the browser auto-generates extra tracks along.
export interface GridImplicitDiagramProps {
  // "rows" adds an extra implicit row at the bottom; "columns" adds an extra implicit column on the right.
  variant: GridImplicitVariant;
}

// The two axes the post shows the browser auto-generating implicit tracks along.
export type GridImplicitVariant = "rows" | "columns";

// One cell in either panel: its column/row position, its label, and whether it's a browser-generated implicit track.
export interface GridImplicitCell {
  // Zero-based column index within its panel.
  col: number;
  // Zero-based row index within its panel.
  row: number;
  // Text rendered inside the cell.
  label: string;
  // Whether this cell is a browser-generated implicit track, styled differently from the explicit baseline.
  isNew: boolean;
}
