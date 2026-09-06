// Width/height of one discrete mix swatch, and the gap between adjacent swatches in a row.
export const SWATCH_W = 100;
export const SWATCH_H = 64;
export const SWATCH_GAP = 10;

// Left edge of the first swatch in either row, and the vertical position of each row.
export const ROW_X = 10;
export const ROW_SRGB_Y = 46;
export const ROW_OKLCH_Y = 176;

/*
  Same two named colors used in the mastering-css-gradients post's own "gray dead zone" example (blue and
  yellow), so this diagram reads as directly comparable rather than a coincidentally similar pair — that
  post shows the zone forming in a smooth gradient, this one shows it forming in `color-mix()`'s discrete
  output instead.

  Each column is one `color-mix()` call at a fixed percentage of color B (yellow), e.g. the 50% column is
  `color-mix(in <space>, blue, yellow 50%)`. The srgb row is exact: component-wise averaging (0,0,255) and
  (255,255,0) lands EXACTLY on mid-gray (127,127,127) at 50% — not an approximation, that IS what sRGB
  interpolation computes. The oklch row's in-between values are hand-picked to be representative of real
  oklch() output (a vivid teal, never gray) rather than full colorimetric conversion — the sandbox's live
  preview uses the browser's actual `color-mix()` for exact, real computed color.
*/
export const MIX_COLUMNS = [
  { percent: 0, srgb: "#0000ff", oklch: "#0000ff" },
  { percent: 25, srgb: "#4040bf", oklch: "#0086c8" },
  { percent: 50, srgb: "#808080", oklch: "#00b48f" },
  { percent: 75, srgb: "#bfbf40", oklch: "#5ec257" },
  { percent: 100, srgb: "#ffff00", oklch: "#ffff00" }
];

// Index into MIX_COLUMNS of the swatch the "gray dead zone" callout points at — the exact-gray 50% column.
export const DEAD_ZONE_INDEX = 2;
