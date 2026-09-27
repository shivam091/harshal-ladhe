/*
  Three stops instead of the post's usual two — with a purple end, "which part of the gradient did this line get?"
  is readable at a glance, which is the whole question the diagram answers.
*/
export const GRADIENT_STOPS = ["#ff6a00", "#ee0979", "#6366f1"];

// Left edge of each column — "slice" (the default) on the left, "clone" on the right.
export const SLICE_X = 24;
export const CLONE_X = 290;

/*
  The wrapped heading's line fragments. Each line's width is pinned with SVG textLength, so the "laid end to end"
  gradient offsets below are exact rather than guessed from font metrics.
*/
export const LINES = [
  { text: "Gradient text", width: 170, baseline: 128 },
  { text: "that wraps", width: 120, baseline: 166 },
  { text: "across lines", width: 150, baseline: 204 }
];

// Every fragment laid end to end — the one long strip a sliced background is painted across.
export const TOTAL_WIDTH = LINES.reduce((sum, line) => sum + line.width, 0);

// How far along that strip each line starts, so each line can be given its own slice of the gradient.
export const LINE_OFFSETS = LINES.map((_, index) => LINES.slice(0, index).reduce((sum, line) => sum + line.width, 0));

// The miniature strip drawn above each column, showing the gradient each line's fragment is cut from.
export const STRIP = { y: 50, height: 16, width: 220, gap: 6 };

// Scale that maps the strip's real fragment widths down to fit in one column above the text.
export const STRIP_SCALE = STRIP.width / TOTAL_WIDTH;

// Glyph size for the wrapped heading lines.
export const LINE_FONT_SIZE = 28;
