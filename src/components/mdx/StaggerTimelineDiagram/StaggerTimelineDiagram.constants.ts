import type { StaggerPanel } from "@/components/mdx/StaggerTimelineDiagram/StaggerTimelineDiagram.types";

// Mirrors the post's product-grid rule: 50ms per card, 300ms transition, and the 40-card grid the warning warns about.
export const STEP_MS = 50;
// Fixed so the only thing that varies between the panels is the stagger.
export const DURATION_MS = 300;
// Large enough that an uncapped stagger visibly becomes a long wait.
export const CARD_COUNT = 40;

// Time axis runs just past the uncapped batch's finish (39 × 50ms + 300ms = 2.25s).
export const AXIS_MAX_MS = 2400;
// Marks 0ms, where the first card starts.
export const AXIS_LEFT = 40;
// Marks the latest time shown, so both panels share one scale.
export const AXIS_RIGHT = 400;

// Thin bars so all 40 cards fit, which is what makes the uncapped ramp's length visible.
export const BAR_H = 2.5;
// Keeps adjacent bars distinguishable even when they are thin.
export const BAR_GAP = 1;

// The uncapped formula versus min(var(--index), 8), plotted on the same time axis.
export const PANELS: StaggerPanel[] = [
  { heading: "calc(var(--index) * 50ms)", cap: null, y: 40, callout: "card 40 starts at 1.95s", calloutSide: "before" },
  { heading: "calc(min(var(--index), 8) * 50ms)", cap: 8, y: 245, callout: "cards 9–40 start at 0.4s", calloutSide: "after" },
];
