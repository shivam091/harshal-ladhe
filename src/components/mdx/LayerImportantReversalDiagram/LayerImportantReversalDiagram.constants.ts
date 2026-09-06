// Shared monospace stack for CSS selector/declaration text, matching the site's other code-adjacent diagrams.
export const MONO_FONT =
  "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  The exact same two rules as LayerSpecificityDiagram, but both now carry `!important`. Layer priority
  for `!important` declarations is the REVERSE of normal declarations, so the winner flips: `base`
  (declared first) now beats `utilities` (declared last) — the opposite outcome from the non-important
  version, using the identical layer order and selectors.
*/
export const RULE_CARDS = [
  {
    // Declared first — now WINS, because !important reverses layer priority.
    x: 30,
    layerName: "base",
    layerOrder: "declared 1st",
    selector: "#card .title.title",
    declaration: "color: royalblue !important;",
    wins: true
  },
  {
    // Declared second (last) — now LOSES, despite winning in the non-important version.
    x: 320,
    layerName: "utilities",
    layerOrder: "declared 2nd",
    selector: ".text-accent",
    declaration: "color: var(--accent) !important;",
    wins: false
  }
];

export const CARD_W = 250;
export const CARD_Y = 128;
export const CARD_H = 118;
