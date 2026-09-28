// Shared corner radius for every primitive box, so they read as one family distinct from the pill-shaped inputs/output.
export const BOX_RADIUS = 10;

/*
  SourceAlpha starts the chain as a pill, not a box, because it's an implicit input rather than a step: the
  shadow is built from the silhouette alone, so the original colours never pass through the blur.
*/
export const SOURCE_ALPHA = { x: 16, y: 26, width: 120, height: 56 };

// SourceGraphic sits beside feMerge rather than at the top, because its only job is to be painted over the shadow.
export const SOURCE_GRAPHIC = { x: 16, y: 308, width: 130, height: 56 };

// Shape of one primitive box — its own interface so the constants below stay type-checked against each other.
export interface PipelineStage {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  lines: string[];
}

/*
  The four chained primitives before the merge, in pipeline order. Each `lines` entry spells out that box's
  in/in2/result values so the named hand-off is visible without reading markup — that hand-off is the point.
  feFlood deliberately lists no input: it's the one primitive here that generates pixels instead of reading them.
*/
export const STAGES: PipelineStage[] = [
  { x: 196, y: 18, width: 170, height: 72, title: "feGaussianBlur", lines: ["in: SourceAlpha", "result: blur"] },
  { x: 470, y: 18, width: 170, height: 72, title: "feOffset", lines: ["in: blur", "result: offsetBlur"] },
  { x: 196, y: 150, width: 170, height: 88, title: "feFlood", lines: ["(no input)", "flood-color, flood-opacity", "result: flood"] },
  { x: 430, y: 150, width: 210, height: 88, title: "feComposite", lines: ["operator: in", "in: flood · in2: offsetBlur", "result: shadow"] }
];

// The feMerge box — wide enough to list both feMergeNode children stacked in paint order.
export const MERGE_BOX = { x: 190, y: 290, width: 360, height: 92 };

/*
  The feMergeNode children inside feMerge, in the order they actually paint: first-listed paints first (behind),
  last-listed paints on top — exactly why the shadow is listed before the original SourceGraphic.
*/
export const MERGE_NODES = ["feMergeNode → in: shadow", "feMergeNode → in: SourceGraphic"];

// Bounds of the "filtered output" pill closing out the chain, centred under feMerge.
export const OUTPUT = { x: 270, y: 410, width: 200, height: 40 };
