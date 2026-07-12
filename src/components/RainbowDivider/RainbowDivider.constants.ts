// Number of diagonal line segments making up the zigzag.
export const NUM_SEGMENTS = 8;

// Horizontal span of a single segment (distance from its low end to its high end).
export const SEGMENT_WIDTH = 20;

/*
  Horizontal distance between the start of one segment and the start of the next — smaller than
  SEGMENT_WIDTH so consecutive segments overlap slightly, keeping the zigzag continuous.
*/
export const SEGMENT_OFFSET_STEP = 15;

// Vertical span of every segment (low end sits at this y, high end at y=0) — also the viewBox height.
export const LINE_HEIGHT = 30;

// viewBox width: enough to fit every segment's offset plus its own width.
export const VIEWBOX_WIDTH = NUM_SEGMENTS * SEGMENT_OFFSET_STEP + SEGMENT_WIDTH;

// viewBox height — matches LINE_HEIGHT since segments span the full height.
export const VIEWBOX_HEIGHT = LINE_HEIGHT;

// How much wider (as a multiple of SEGMENT_WIDTH) segment 0 stretches while press-and-held, flattening its angle as if the row is being pulled taut.
export const HOLD_STRETCH_FACTOR_BASE = 1.4;

// How much more each successive segment's hold stretch factor grows over the previous one, so the flattening deepens left-to-right.
export const HOLD_STRETCH_FACTOR_STEP = 0.1;

// Percent of the `cover` view-timeline range (50% = viewport's vertical middle) by which every segment must finish revealing.
export const REVEAL_END_PERCENT = 50;

// Per-segment delay (as a percent of the reveal range) before it starts drawing — segment 0 starts first, each next one a step later.
export const REVEAL_STAGGER_STEP = REVEAL_END_PERCENT / NUM_SEGMENTS;

// Per-segment click-flip delay (ms) — small enough to read as one gesture, not eight separate ones.
export const FLIP_STAGGER_DELAY_MS = 12;

/*
  Rainbow hues (as full hsl() strings) assigned to segments left-to-right, curated rather than
  evenly spaced around the color wheel for a more pleasant gradient.
*/
export const SEGMENT_COLORS = [
  "hsl(350deg 100% 65%)",
  "hsl(25deg 100% 65%)",
  "hsl(50deg 100% 65%)",
  "hsl(150deg 100% 65%)",
  "hsl(210deg 100% 65%)",
  "hsl(240deg 100% 65%)",
  "hsl(260deg 100% 70%)",
  "hsl(300deg 100% 65%)"
] as const;
