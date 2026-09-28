// The masked element's bounding box — 200 × 160 so the −10% / 120% margins land on whole numbers (20 and 16).
export const BBOX = { x: 120, y: 90, width: 200, height: 160 };

// The default mask region derived from BBOX: x/y = −10%, width/height = 120% of the bounding box.
export const REGION = {
  x: BBOX.x - BBOX.width * 0.1,
  y: BBOX.y - BBOX.height * 0.1,
  width: BBOX.width * 1.2,
  height: BBOX.height * 1.2
};

/*
  Mask content deliberately larger than REGION on every side (think: a blurred glow), so the part the region
  cuts off is visible as a ghost outline instead of being silently lost like it is in a real render.
*/
export const CONTENT = { cx: 220, cy: 170, rx: 150, ry: 115 };

/*
  Legend rows, each pairing a sample swatch style with what it represents. `dash` mirrors the matching drawn
  outline so the key can be read without colour alone.
*/
export const LEGEND = [
  { y: 86, stroke: "var(--color-border-attention-emphasis)", dash: "6 4", title: "mask region", note: "default x/y −10%, width/height 120%" },
  { y: 146, stroke: "var(--color-border-accent-emphasis)", dash: undefined, title: "element bounding box", note: "fill geometry only — stroke excluded" },
  { y: 206, stroke: "var(--color-fg-muted)", dash: "2 3", title: "mask content past the region", note: "never painted — e.g. a blur's tail" }
];
