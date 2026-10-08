// Slab geometry: a parallelogram reads as a flat sheet seen at an angle, which is the "exploded stack" metaphor.
export const SLAB = { x: 56, width: 210, skew: 44, height: 30, gap: 54, bottomY: 372 };

// Where each slab's label column starts — far enough right that the leader lines stay visibly separate.
export const LABEL_X = 326;

/*
  The seven painting layers of one stacking context, bottom (painted first) to top (painted last). Sub-labels are
  kept under ~50 characters so the label column fits inside the viewBox on every screen.
*/
export const LAYERS = [
  { title: "Background and borders", detail: "of the element that formed the context", fill: "var(--color-bg-neutral-muted)", stroke: "var(--color-border-default)" },
  { title: "Negative z-index", detail: "positioned descendants, lowest value first", fill: "var(--color-bg-danger-muted)", stroke: "var(--color-border-danger-emphasis)" },
  { title: "Block boxes in normal flow", detail: "non-positioned, block-level descendants", fill: "var(--color-bg-muted)", stroke: "var(--color-border-default)" },
  { title: "Floats", detail: "non-positioned floating descendants", fill: "var(--color-bg-muted)", stroke: "var(--color-border-default)" },
  { title: "Inline content", detail: "text, inline images, inline-block boxes", fill: "var(--color-bg-muted)", stroke: "var(--color-border-default)" },
  { title: "z-index: auto or 0", detail: "positioned elements + opacity/transform contexts", fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" },
  { title: "Positive z-index", detail: "positioned descendants, lowest value first", fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" }
];
