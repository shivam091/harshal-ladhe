// The divider owns all its behaviour, so only outer styling is configurable.
export interface RainbowDividerProps {
  // Lets the surrounding layout position and size the divider without a wrapper element.
  className?: string;
}

// Precomputed so the springs only interpolate between fixed path strings instead of rebuilding geometry per frame.
export interface SegmentGeometry {
  // Hue for this segment's slice of the rainbow.
  color: string;
  // Drives the stagger so both the flip and the scroll reveal sweep left-to-right.
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
