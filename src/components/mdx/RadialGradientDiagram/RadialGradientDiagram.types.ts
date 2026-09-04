// Which half of the "Radial Gradient" subsection RadialGradientDiagram illustrates.
type RadialGradientVariant = "shape" | "size";

// Props for RadialGradientDiagram — selects which half of the concept to illustrate.
export interface RadialGradientDiagramProps {
  // "shape" contrasts circle vs. ellipse; "size" contrasts the 4 size keywords from an off-center origin.
  variant: RadialGradientVariant;
}

// One labeled boundary circle in the "size" variant — one entry per CSS size keyword.
export interface RadialGradientSizeBoundary {
  // The CSS size keyword this boundary represents, e.g. "closest-side".
  keyword: string;
  // Radius of the boundary circle, in local panel coordinates, measured from the off-center origin point.
  radius: number;
  // Theme border-emphasis token used for both the stroke and its legend swatch.
  color: string;
  // SVG stroke-dasharray so the boundary reads even without color (accessibility — never color alone).
  dashArray: string;
}
