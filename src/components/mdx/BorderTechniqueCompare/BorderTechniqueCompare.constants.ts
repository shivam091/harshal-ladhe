// Start/end stops of the post's recurring gradient, so all three cards match the code samples.
export const GRADIENT_START = "#ff6a00";
export const GRADIENT_END = "#ee0979";

// Same monospace stack the other mdx diagrams use for inline CSS.
export const CODE_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// The striped backdrop all three cards sit on — busy on purpose, so a solid vs. see-through center is obvious.
export const BACKDROP = { x: 10, y: 10, width: 520, height: 140, radius: 10 };

// Every card's size and vertical position, plus the border-radius each one *asks* for.
export const CARD = { width: 140, height: 90, y: 35, radius: 18 };

// Border thickness, exaggerated slightly so the ring and corners are easy to judge.
export const BORDER = 7;

/*
  The post's three core techniques, with the two properties its comparison table hinges on. `rounded` and
  `seeThrough` drive both the drawing (square vs. rounded ring, solid vs. hollow center) and the ✓/✗ captions,
  so the picture and the verdict can't disagree.
*/
export const TECHNIQUES = [
  { key: "border-image", x: 30, rounded: false, seeThrough: true },
  { key: "background-clip", x: 200, rounded: true, seeThrough: false },
  { key: "mask", x: 370, rounded: true, seeThrough: true }
] as const;
