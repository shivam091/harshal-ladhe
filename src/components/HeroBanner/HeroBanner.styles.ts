import { styled } from "@linaria/react";

// Positioned absolutely so it sits behind the hero text and bleeds full-width.
export const HeroBannerContainer = styled.div`
  position: absolute;
  inset: 5rem 0 auto;
  isolation: isolate;
  background: var(--color-bg-sky-from);
  overflow: clip;
  margin-block-start: calc(-1 * 5rem - 2.75rem);
  padding-block-start: calc(5rem + 2.75rem);
  inline-size: 100vw;
  z-index: 0;
  pointer-events: none;
`;

// Stacked flex column so the SVG aligns to the bottom edge of each sky layer.
const SkyLayerBase = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: clip;
  transition: background calc(350ms + 500ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Back sky gradient layer — farthest depth, pulled up slightly to eliminate seams.
export const SkyLayerBack = styled(SkyLayerBase)`
  background: linear-gradient(to bottom, var(--color-bg-sky-from), var(--color-bg-sky-to));
  margin-block-start: calc(-1 * 2rem);
`;

// Absolute front layer (z-index 3) that holds the foreground cloud SVGs.
export const SkyLayerFront = styled(SkyLayerBase)`
  position: absolute;
  z-index: 3;
  inset: auto 0 0;
`;

// Wider than the viewport so cloud shapes fill any screen width; nudged 1 px down to close sub-pixel gaps.
export const SkySvg = styled.svg`
  display: block;
  max-inline-size: revert;
  min-inline-size: 320rem;
  --magic-number: calc(-50vw + 25rem);
  margin-block-start: -1rem;
  transform: translateZ(0) translate(var(--magic-number), 1px);

  @media (width > 48rem) {
    margin-block-start: 0;
    transform: translateZ(0) translateY(1px);
  }
`;

// Each cloud layer transitions fill independently at different speeds for a parallax-like depth effect.
export const CloudBackground = styled.path`
  fill: var(--color-bg-cloud-500);
  transition: fill calc(350ms + 120ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Mid-depth cloud fill — slower transition than foreground creates parallax depth.
export const CloudMidground = styled.path`
  fill: var(--color-bg-cloud-300);
  transition: fill calc(350ms + 240ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Foreground cloud fill — transitions to the page background color on theme swap.
export const CloudForeground = styled.path`
  fill: var(--color-bg-default);
  transition: fill 350ms cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Pure-white star shapes visible against the sky gradient.
export const Star = styled.path`
  fill: hsl(0 0% 100%);
`;

/*
  Planets — hand-placed decorative bodies (not part of the seeded star field), shaded via
  the radial gradients defined in HeroBanner.tsx's <defs> to read as spheres rather than
  flat discs. Colors are fixed (not theme tokens), same as Star, since a planet's hue is
  a real-world fact rather than something that should shift with the site theme.
*/
export const PlanetSaturnBody = styled.circle`
  fill: url(#planet-saturn-gradient);
`;

export const PlanetMoonBody = styled.circle`
  fill: url(#planet-moon-gradient);
`;

export const PlanetMarsBody = styled.circle`
  fill: url(#planet-mars-gradient);
`;

export const PlanetJupiterBody = styled.circle`
  fill: url(#planet-jupiter-gradient);
`;

export const PlanetNeptuneBody = styled.circle`
  fill: url(#planet-neptune-gradient);
`;

export const PlanetEarthBody = styled.circle`
  fill: url(#planet-earth-gradient);
`;

export const PlanetVenusBody = styled.circle`
  fill: url(#planet-venus-gradient);
`;

export const PlanetUranusBody = styled.circle`
  fill: url(#planet-uranus-gradient);
`;

export const PlanetMercuryBody = styled.circle`
  fill: url(#planet-mercury-gradient);
`;

// Half of Saturn's ring ellipse, drawn before the planet body so the sphere occludes it.
export const PlanetRingBack = styled.path`
  fill: none;
  stroke: hsl(42 45% 62%);
  stroke-width: 8;
  stroke-linecap: round;
  opacity: 0.55;
`;

// The other half, drawn after the planet body so it reads as passing in front.
export const PlanetRingFront = styled.path`
  fill: none;
  stroke: hsl(42 60% 78%);
  stroke-width: 8;
  stroke-linecap: round;
  opacity: 0.92;
`;

// Uranus's rings are near-vertical (its axial tilt is ~98°) rather than Saturn's near-horizontal —
// same front/back split technique, just thinner and fainter since they're a much subtler feature.
export const PlanetRingBackThin = styled.path`
  fill: none;
  stroke: hsl(190 30% 60%);
  stroke-width: 3;
  stroke-linecap: round;
  opacity: 0.4;
`;

export const PlanetRingFrontThin = styled.path`
  fill: none;
  stroke: hsl(190 35% 74%);
  stroke-width: 3;
  stroke-linecap: round;
  opacity: 0.75;
`;

// Faint cloud-band lines clipped to a gas giant's disc (Jupiter/Venus).
export const PlanetBand = styled.line`
  stroke: hsl(30 40% 20% / 0.18);
  stroke-width: 3;
  stroke-linecap: round;
`;

// Crater/surface-feature ellipses clipped to a planet's disc.
export const PlanetSurfaceFeature = styled.ellipse`
  fill: hsl(0 0% 0% / 0.16);
`;

// Earth's continents — irregular landmass blobs clipped to the disc, greener/browner than the ocean gradient underneath.
export const PlanetLandmass = styled.path`
  fill: hsl(100 25% 38%);
`;

// Thin white cloud wisps drawn over Earth's landmasses.
export const PlanetClouds = styled.path`
  fill: none;
  stroke: hsl(0 0% 100% / 0.55);
  stroke-width: 2.5;
  stroke-linecap: round;
`;
