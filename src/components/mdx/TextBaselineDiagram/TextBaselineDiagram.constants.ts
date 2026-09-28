// Glyph run size and origin — large so every baseline has visible room between its neighbours.
export const GLYPHS = { text: "Hxgp", x: 180, y: 190, fontSize: 110 };

// Horizontal extent of every guide line — starts just left of the glyphs so the anchor dot sits on the lines, ends before the labels.
export const LINE_SPAN = { x1: 160, x2: 470 };

// Column the right-hand labels start at, clear of the longest guide line.
export const LABEL_X = 480;

/*
  Guide lines, top to bottom. Positions are typical fractions of the em for a Latin sans-serif, not measured from
  any one font — real values come from each font's own metrics, which is exactly why the caption says "approx".
  `side` puts central's label on the left because it lands within a few units of middle, and two labels stacked
  that close on one side would overlap. `kind` separates real dominant-baseline values from plain font metrics.
*/
export const BASELINES = [
  { label: "hanging", y: 102, side: "right", kind: "value", tone: "success" },
  { label: "x-height (metric)", y: 133, side: "right", kind: "metric", tone: "muted" },
  { label: "central", y: 157, side: "left", kind: "value", tone: "attention" },
  { label: "middle", y: 162, side: "right", kind: "value", tone: "attention" },
  { label: "alphabetic (auto)", y: 190, side: "right", kind: "value", tone: "accent" },
  { label: "descender (metric)", y: 214, side: "right", kind: "metric", tone: "muted" }
] as const;

// Stroke colour per tone — theme tokens only so the guides stay legible in light and dark mode.
export const TONE_STROKE = {
  success: "var(--color-border-success-emphasis)",
  attention: "var(--color-border-attention-emphasis)",
  accent: "var(--color-border-accent-emphasis)",
  muted: "var(--color-border-default)"
} as const;
