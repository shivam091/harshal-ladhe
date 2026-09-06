// Shared monospace stack for CSS-flavored text, matching the site's other code-adjacent diagrams.
export const MONO_FONT =
  "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

export const RUNG_X = 40;
export const RUNG_W = 380;
export const RUNG_H = 64;
export const RUNG_GAP = 12;
export const RUNG_START_Y = 42;

/*
  The complete, official cascade sort order (CSS Cascading and Inheritance Level 5 + MDN), highest
  priority first — with `@layer` correctly inserted into the origin/importance tier rather than treated
  as a separate step. This is the single fact this diagram exists to get exactly right: cascade layers
  are NOT a 4th criterion alongside origin/specificity/source-order — they're a sub-ordering INSIDE the
  author-normal and author-important tiers of "origin and importance," step 1 of the cascade.
*/
export const RUNGS = [
  {
    label: "Transition declarations",
    sublabel: "a property actively animating via a CSS transition",
    tone: "accent",
    layerNote: false
  },
  {
    label: "!important — user-agent",
    sublabel: "the browser's own !important defaults (rare)",
    tone: "neutral",
    layerNote: false
  },
  {
    label: "!important — user",
    sublabel: "user stylesheets / browser extensions, !important",
    tone: "neutral",
    layerNote: false
  },
  {
    label: "!important — author",
    sublabel: "unlayered = lowest; among layers, the EARLIER layer wins",
    tone: "danger",
    layerNote: true
  },
  {
    label: "Normal — author",
    sublabel: "unlayered = highest; among layers, the LATER layer wins",
    tone: "success",
    layerNote: true
  },
  {
    label: "Normal — user",
    sublabel: "user stylesheets / browser extensions, normal",
    tone: "neutral",
    layerNote: false
  },
  {
    label: "Normal — user-agent",
    sublabel: "the browser's own built-in default styles",
    tone: "muted",
    layerNote: false
  }
].map((rung, index) => ({
  ...rung,
  y: RUNG_START_Y + index * (RUNG_H + RUNG_GAP)
}));

// Fill/border/text CSS custom properties per "tone" — reused across every rung of a given kind.
export const TONE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  accent: { bg: "var(--color-bg-accent-muted)", border: "var(--color-border-accent-emphasis)", text: "var(--color-fg-accent)" },
  danger: { bg: "var(--color-bg-danger-muted)", border: "var(--color-border-danger-emphasis)", text: "var(--color-fg-danger)" },
  success: { bg: "var(--color-bg-success-muted)", border: "var(--color-border-success-emphasis)", text: "var(--color-fg-success)" },
  neutral: { bg: "var(--color-bg-neutral-muted)", border: "var(--color-border-neutral-muted)", text: "var(--color-fg-default)" },
  muted: { bg: "var(--color-bg-muted)", border: "var(--color-border-muted)", text: "var(--color-fg-muted)" }
};
