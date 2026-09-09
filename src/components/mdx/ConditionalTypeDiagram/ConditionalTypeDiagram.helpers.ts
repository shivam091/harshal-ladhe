// Approximates a monospace label's rendered width at this diagram's font size, so every box can hug
// its own text instead of every label needing a hand-measured constant. `charWidth`/`paddingX` were
// tuned against 'Source Code Pro' at 12px — the font this diagram's Svg is styled with.
export function boxWidthForLabel(label: string, charWidth = 7.2, paddingX = 24): number {
  return Math.max(96, Math.round(label.length * charWidth + paddingX));
}
