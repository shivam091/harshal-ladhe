/*
  One row of the diagram: an entry or exit transition, and where along its duration the discrete property
  (display, content-visibility, or overlay) actually flips.
*/
export interface AllowDiscreteRow {
  // y coordinate of this row's timeline.
  y: number;
  // Row heading, e.g. "Entry (closed → open)".
  heading: string;
  // Which ramp this row draws — entry fades in, exit fades out.
  direction: "in" | "out";
  // x position of the discrete-property flip marker on this row's timeline.
  flipX: number;
  // Label describing the flip, e.g. "display: none → block".
  flipLabel: string;
  // Caption printed under the row.
  caption: string;
}

// Which timing story the diagram tells: display's entry/exit flips, or overlay's top-layer exit with and without it.
export type AllowDiscreteVariant = "display" | "overlay";

// Props for AllowDiscreteTimelineDiagram.
export interface AllowDiscreteTimelineDiagramProps {
  // Registry key into the diagram's variants, so each row set and its accessible text live together. Default: `"display"`
  variant?: AllowDiscreteVariant;
}

// Everything one variant needs: its rows plus the accessible title and description announced for them.
export interface AllowDiscreteVariantDefinition {
  // Accessible SVG <title>.
  title: string;
  // Accessible SVG <desc>, spelling out what the timelines show for screen-reader users.
  description: string;
  // The two timelines drawn, top to bottom.
  rows: AllowDiscreteRow[];
}
