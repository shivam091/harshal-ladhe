// Returns to its origin each cycle so drifting stars never wander out of the composition.
interface StarDrift {
  // Full there-and-back cycle length, in seconds.
  dur: number;
  // Signed so stars wander in different horizontal directions.
  dx: number;
  // Signed so stars wander in different vertical directions.
  dy: number;
}

// Precomputed per star so rendering is a plain map with no randomness at render time.
export interface Star {
  // Horizontal position within the sky SVG's viewBox coordinate space.
  x: number;
  // Vertical position within the sky SVG's viewBox coordinate space.
  y: number;
  // Tied to brightness so brighter stars read as bigger, like real ones.
  size: number;
  // Full opacity-pulse cycle length, in seconds.
  twinkleDur: number;
  // Per-star stagger before the twinkle animation starts, in seconds — keeps stars from pulsing in unison.
  twinkleBegin: number;
  // Minimum opacity reached mid-twinkle — brightness-correlated, so dimmer stars dip lower.
  twinkleFrom: number;
  // Null for some stars so the field mixes still and drifting points.
  drift: StarDrift | null;
}
