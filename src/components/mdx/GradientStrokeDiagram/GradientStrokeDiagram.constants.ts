// Start stop of the post's own stroke-text example (`.stroke-gradient`), so the diagram matches the code above it.
export const GRADIENT_START = "#00dbde";
// End stop of the same `.stroke-gradient` example.
export const GRADIENT_END = "#fc00ff";

// Monospace stack for the inline CSS labels, so they read as code beside the prose.
export const CODE_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// Size and vertical position of each panel — the panel's fill stands in for "the background behind the text".
export const PANEL = { width: 190, height: 140, y: 44 };

// Sample glyphs — a counter in each ("A", "b") so the fill-versus-stroke difference shows inside the letters too.
export const GLYPHS = "Ab";
// Heavy glyph size, so the stroke ring is clearly separate from the fill.
export const GLYPH_SIZE = 100;
// Baseline inside each panel, keeping the glyphs roughly centred vertically.
export const GLYPH_BASELINE = 108;

/*
  Static (non-variable) fonts only for the glyphs — the site's variable font builds letters from overlapping contours,
  and a stroke outlines every one of them, drawing seams inside the "A" and "b" that real stroke text wouldn't show.
*/
export const GLYPH_FONT = "Arial, Helvetica, 'Liberation Sans', sans-serif";

// Exaggerated stroke width (the post uses 3px) so the ring is legible at diagram scale.
export const STROKE_WIDTH = 5;

/*
  The wrong way (transparent fill) on the left and the right way (fill = background) on the right — the post's
  Warning callout describes the left panel in words; this makes the failure visible.
*/
export const VARIANTS = [
  { key: "transparent", x: 20, works: false, title: "fill: transparent", caption: ["gradient shows through the", "whole glyph — no outline"] },
  { key: "background", x: 250, works: true, title: "fill: the background color", caption: ["fill covers the middle — only", "the stroke ring shows the gradient"] }
] as const;
