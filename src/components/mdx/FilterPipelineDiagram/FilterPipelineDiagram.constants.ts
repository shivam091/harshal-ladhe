// Shared corner radius for the two feGaussianBlur/feOffset primitive boxes.
export const BOX_RADIUS = 10;

/*
  Bounds of the implicit "SourceGraphic" pill that starts the chain. Drawn as a pill (large rx) rather than a
  primitive box so it reads as "the input every filter starts with," not a step the filter itself performs.
*/
export const SOURCE_GRAPHIC = { x: 20, y: 26, width: 140, height: 56 };

/*
  The 2 chained filter primitives, left-to-right in pipeline order. Each `lines` entry is its own text row
  inside the box, spelling out the `in`/`result` values so the named hand-off is visible without hovering
  or reading markup — that hand-off is the entire point of this diagram.
*/
export const STAGES = [
  {
    x: 210,
    y: 18,
    width: 180,
    height: 72,
    title: "feGaussianBlur",
    lines: ["in: SourceGraphic", "result: blurred"]
  },
  {
    x: 460,
    y: 18,
    width: 180,
    height: 72,
    title: "feOffset",
    lines: ["in: blurred", "result: offsetBlur"]
  }
];

// The feMerge box — wider than the other 2 since it lists both feMergeNode children stacked in paint order.
export const MERGE_BOX = { x: 140, y: 168, width: 380, height: 92 };

/*
  The feMergeNode children inside feMerge, in the order they actually paint: first-listed paints first (behind),
  last-listed paints on top — exactly why the shadow (offsetBlur) is listed before the original (SourceGraphic).
*/
export const MERGE_NODES = ["feMergeNode → in: offsetBlur", "feMergeNode → in: SourceGraphic"];

// Bounds of the "filtered output" pill closing out the chain.
export const OUTPUT = { x: 230, y: 288, width: 200, height: 40 };
