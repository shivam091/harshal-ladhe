// Matches the palette size so every segment gets its own hue.
export const NUM_SEGMENTS = 8;

// Together with LINE_HEIGHT, sets how steep each zigzag stroke looks.
export const SEGMENT_WIDTH = 20;

/*
  Horizontal distance between the start of one segment and the start of the next — smaller than
  SEGMENT_WIDTH so consecutive segments overlap slightly, keeping the zigzag continuous.
*/
export const SEGMENT_OFFSET_STEP = 15;

// Shared by every segment so the zigzag's peaks and troughs line up.
export const LINE_HEIGHT = 30;

// Derived from the segment layout so the last segment is never clipped.
export const VIEWBOX_WIDTH = NUM_SEGMENTS * SEGMENT_OFFSET_STEP + SEGMENT_WIDTH;

// viewBox height — matches LINE_HEIGHT since segments span the full height.
export const VIEWBOX_HEIGHT = LINE_HEIGHT;

// Stretching on press-and-hold flattens the segments, as if the row is being pulled taut.
export const HOLD_STRETCH_FACTOR_BASE = 1.4;

// Grows per segment so the pull reads as deepening left-to-right.
export const HOLD_STRETCH_FACTOR_STEP = 0.1;

// Finishes the reveal by mid-viewport so readers never see a half-drawn divider at rest.
export const REVEAL_END_PERCENT = 50;

// Spread across the reveal so segments start one after another yet still finish together.
export const REVEAL_STAGGER_STEP = REVEAL_END_PERCENT / NUM_SEGMENTS;

// Per-segment click-flip delay (ms) — small enough to read as one gesture, not eight separate ones.
export const FLIP_STAGGER_DELAY_MS = 12;

// Hand-picked rather than evenly spaced, since even hue steps make a less pleasant gradient.
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
