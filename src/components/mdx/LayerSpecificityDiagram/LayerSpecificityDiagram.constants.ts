// Same monospace stack as the other mdx diagrams, so CSS labels look identical in every post.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  A component-versus-utility conflict, since that's the fight cascade layers are usually adopted to end. The gap in
  specificity is as wide as a real stylesheet plausibly gets — an ID and two classes against one class — so when
  the utility wins, nothing but layer order can explain it.
*/
export const RULE_CARDS = [
  {
    // Declared first — lower priority, no matter how specific its selector is.
    x: 30,
    layerName: "base",
    layerOrder: "declared 1st",
    selector: "#card .title.title",
    declaration: "color: royalblue;",
    specificity: "1, 2, 0",
    specificityNote: "id + 2 classes — high",
    wins: false
  },
  {
    // Declared second (last) — higher priority purely because of layer order.
    x: 320,
    layerName: "utilities",
    layerOrder: "declared 2nd",
    selector: ".text-accent",
    declaration: "color: var(--accent);",
    specificity: "0, 1, 0",
    specificityNote: "1 class — low",
    wins: true
  }
];

// Card geometry: below the layer order strip, which has to be read first, and tall enough for the specificity lines.
export const CARD_W = 250;
export const CARD_Y = 128;
export const CARD_H = 140;
