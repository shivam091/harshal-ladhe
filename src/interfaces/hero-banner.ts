// Slow SVG animateTransform drift — a star gently wanders and returns to its origin.
interface StarDrift {
  // Full there-and-back cycle length, in seconds.
  dur: number;
  // Horizontal wander distance from the star's origin, in px (signed — direction varies per star).
  dx: number;
  // Vertical wander distance from the star's origin, in px (signed — direction varies per star).
  dy: number;
}

// One star's full set of layout and animation properties, as consumed by HeroBanner's SVG <use> markup.
export interface Star {
  // Horizontal position within the sky SVG's viewBox coordinate space.
  x: number;
  // Vertical position within the sky SVG's viewBox coordinate space.
  y: number;
  // Rendered width/height of the star symbol, in SVG units — brightness-correlated (see BRIGHTNESS_SKEW).
  size: number;
  // Full opacity-pulse cycle length, in seconds.
  twinkleDur: number;
  // Per-star stagger before the twinkle animation starts, in seconds — keeps stars from pulsing in unison.
  twinkleBegin: number;
  // Minimum opacity reached mid-twinkle — brightness-correlated, so dimmer stars dip lower.
  twinkleFrom: number;
  // Wander animation config, or null for a star that stays fixed in place (see DRIFT_CHANCE).
  drift: StarDrift | null;
}
