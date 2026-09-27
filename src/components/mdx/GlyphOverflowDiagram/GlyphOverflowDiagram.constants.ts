// The post's usual two-stop pair, so the diagram reads as the same gradient text as the examples around it.
export const GRADIENT_STOPS = ["#ff6a00", "#ee0979"];

// Glyph size — large enough that a descender's missing tail is obvious at a glance.
export const FONT_SIZE = 56;

// Every letter pinned to this width with textLength, so the box's right edge is exact rather than guessed from font metrics.
export const WORD_WIDTH = 190;

/*
  A synthetic italic lean (skewX) instead of font-style: italic, so the overhang past the box is the same size in
  every font the diagram might fall back to.
*/
export const SKEW_DEG = -14;

// Shared baseline for both columns.
export const BASELINE = 128;

/*
  The painted box in each column, relative to the word's left edge and baseline. "tight" stops just below the
  baseline (line-height: 0.8) and exactly at the last glyph's advance; "fixed" adds line-height: 1.2 room plus the
  0.1em block-end and inline-end padding.
*/
export const COLUMNS = [
  {
    key: "tight",
    x: 40,
    title: "line-height: 0.8",
    caption: "tails and lean fall outside the box",
    box: { top: -42, bottom: 3, extraRight: 0 }
  },
  {
    key: "fixed",
    x: 300,
    title: "line-height: 1.2 + 0.1em padding",
    caption: "the box now covers every glyph",
    box: { top: -52, bottom: 22, extraRight: 14 }
  }
];
