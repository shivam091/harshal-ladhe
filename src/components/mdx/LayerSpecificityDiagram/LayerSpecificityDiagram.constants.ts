// Shared monospace stack for CSS selector/declaration text, matching the site's other code-adjacent diagrams.
export const MONO_FONT =
  "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  The two competing rules this diagram stages: identical in spirit to a real "component vs. utility"
  conflict — a highly-specific component selector declared in an EARLIER layer, against a single-class
  utility selector declared in a LATER layer. Layer order alone decides the winner here, regardless of
  which card has the scarier-looking selector.
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

export const CARD_W = 250;
export const CARD_Y = 128;
export const CARD_H = 140;
