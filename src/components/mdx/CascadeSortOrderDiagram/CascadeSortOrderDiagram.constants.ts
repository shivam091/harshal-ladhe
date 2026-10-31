// Same monospace stack as the other mdx diagrams, so CSS labels look identical in every post.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  Rung geometry: wide enough for the longest sublabel, inset on the left for the priority arrow, and starting below
  the heading. Every rung shares one size so no origin looks more important than its position says it is.
*/
export const RUNG_X = 40;
export const RUNG_W = 380;
export const RUNG_H = 64;
export const RUNG_GAP = 12;
export const RUNG_START_Y = 42;

/*
  The origin-and-importance rungs of the cascade (CSS Cascading and Inheritance Level 5), highest
  priority first, animations included — leaving one out would misplace every rung below it. Layer
  order only separates declarations that share one of the two author rungs, so those two carry a
  layer note; the tiebreakers within any rung are listed beside the ladder rather than as rungs.
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
    label: "Animations",
    sublabel: "values from running @keyframes animations",
    tone: "accent",
    layerNote: false
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

// Theme tokens rather than raw colours so the ladder follows light and dark mode, with one tone per kind of rung so related rungs read as a group.
export const TONE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  accent: {
    bg: "var(--color-bg-accent-muted)",
    border: "var(--color-border-accent-emphasis)",
    text: "var(--color-fg-accent)"
  },
  danger: {
    bg: "var(--color-bg-danger-muted)",
    border: "var(--color-border-danger-emphasis)",
    text: "var(--color-fg-danger)"
  },
  success: {
    bg: "var(--color-bg-success-muted)",
    border: "var(--color-border-success-emphasis)",
    text: "var(--color-fg-success)"
  },
  neutral: {
    bg: "var(--color-bg-neutral-muted)",
    border: "var(--color-border-neutral-muted)",
    text: "var(--color-fg-default)"
  },
  muted: {
    bg: "var(--color-bg-muted)",
    border: "var(--color-border-muted)",
    text: "var(--color-fg-muted)"
  }
};
