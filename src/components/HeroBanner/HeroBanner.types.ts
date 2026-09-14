// Slow SVG animateTransform drift — an object gently wanders and returns to its origin.
export interface Drift {
  // Full there-and-back cycle length, in seconds.
  dur: number;
  // Horizontal wander distance from the origin, in px (signed — direction varies per instance).
  dx: number;
  // Vertical wander distance from the origin, in px (signed — direction varies per instance).
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
  drift: Drift | null;
}

// Which pre-built <symbol> (defined in HeroBanner.tsx's <defs>) a generated planet renders as.
export type PlanetKind = "saturn" | "jupiter" | "earth" | "uranus" | "neptune" | "venus" | "moon" | "mars" | "mercury";

// One planet's full set of layout and animation properties, as consumed by HeroBanner's SVG <use> markup.
export interface Planet {
  kind: PlanetKind;
  // Horizontal position within the sky SVG's viewBox coordinate space.
  x: number;
  // Vertical position within the sky SVG's viewBox coordinate space.
  y: number;
  // Rendered width of the planet symbol, in SVG units (scaled off the symbol's natural size).
  width: number;
  // Rendered height of the planet symbol, in SVG units (scaled off the symbol's natural size).
  height: number;
  // Wander animation config — every planet drifts a little.
  drift: Drift;
}
