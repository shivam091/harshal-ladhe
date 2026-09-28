// Start stop of the post's mask example (`.gradient-border::before`), so the result panel matches its code.
export const GRADIENT_START = "#ff6a00";
// End stop of the same `.gradient-border::before` example.
export const GRADIENT_END = "#ee0979";

// Size, vertical position, and corner radius of every panel.
export const PANEL = { width: 105, height: 90, y: 50, radius: 12 };

// The pseudo-element's padding — i.e. the border thickness — exaggerated from the post's 3px to be legible.
export const RING = 12;

// Opaque mask colour: in a CSS mask, opaque means "keep this part".
export const KEEP_COLOR = "var(--color-fg-muted)";

/*
  The mask technique as four panels, left to right: mask layer 1 (content box only), mask layer 2 (the whole box),
  what `exclude` leaves (only where exactly one layer is opaque — the padding ring), and that ring applied to the
  gradient over a busy backdrop, proving the centre really is see-through.
*/
export const STEPS = [
  { key: "content", x: 15, title: "① content-box", code: ["opaque over the", "content box only"] },
  { key: "full", x: 160, title: "② whole box", code: ["opaque over the", "whole element"] },
  { key: "ring", x: 305, title: "① exclude ②", code: ["kept only where", "exactly one is opaque"] },
  { key: "result", x: 450, title: "result", code: ["gradient ring —", "center see-through"] }
] as const;

/*
  Labels drawn in the gaps between panels. The gaps are too narrow for the word "exclude", so the first uses ⊕ (the
  XOR symbol) and the third panel's title spells the keyword out.
*/
export const OPERATORS = [
  { x: 142.5, label: "⊕" },
  { x: 287.5, label: "=" },
  { x: 432.5, label: "→" }
];
