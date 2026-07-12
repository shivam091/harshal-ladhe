// Props for RainbowDivider — a decorative, clickable rainbow zigzag divider.
export interface RainbowDividerProps {
  // Forwarded to the root button, letting callers position/size the divider from outside.
  className?: string;
}

// Static per-segment geometry — the four path strings react-spring animates between (rest/flipped, each with a stretched press-and-hold variant).
export interface SegmentGeometry {
  // This segment's rainbow hue, from SEGMENT_COLORS.
  color: string;
  // 0-based left-to-right position, used to stagger both the click-flip delay and the scroll reveal.
  index: number;
  // Resting diagonal path (low end on the left).
  restPath: string;
  // Flipped diagonal path (high end on the left) — shown after a click toggles this segment.
  flippedPath: string;
  // Resting diagonal, stretched flat — shown while press-and-held.
  restHoldPath: string;
  // Flipped diagonal, stretched flat — shown while press-and-held and flipped.
  flippedHoldPath: string;
}
