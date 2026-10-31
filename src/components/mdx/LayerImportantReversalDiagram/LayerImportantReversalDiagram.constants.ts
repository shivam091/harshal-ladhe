// Same monospace stack as the other mdx diagrams, so CSS labels look identical in every post.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  The same selectors and layer order as the layer-order diagram the post shows just before this one, with
  `!important` the only change. Keeping everything else identical means the flipped winner can only be explained by
  the reversal itself.
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

// Card geometry matches the layer-order diagram's, minus the specificity lines, which play no part in this result.
export const CARD_W = 250;
export const CARD_Y = 128;
export const CARD_H = 118;
