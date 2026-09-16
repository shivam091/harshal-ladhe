import { styled } from "@linaria/react";

// Constrains the viewfinder to the same box Stage itself used to size on its own — pulled out a level so the corner brackets and exposure readout below can share that exact box without duplicating the sizing rules.
export const ViewfinderFrame = styled.div`
  position: relative;
  inline-size: 100%;
  max-inline-size: 40rem;
  margin-inline: auto;
`;

/*
  The bounded stage — its background-image is set inline per-render (either the vivid reference
  gradient or one of the site's own photos). For the "filter" target, `filter` is applied directly
  to this same element (CSS's own filter property processes the element and its whole subtree as one
  compositing group) rather than a separate overlay — there's nothing else behind it to distinguish
  from the thing being filtered, unlike backdrop-filter's GlassPanel below.
*/
export const Stage = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  border-radius: 0.375rem;
`;

/*
  Only rendered for the backdropFilter target — a busy optics-calibration test chart (concentric
  rings plus a fine crosshair grid) layered over the subject so the backdrop-filter effect has
  something legibly "busy" to blur/saturate/rotate through, rather than the eye reading a flat
  swatch as just a color change. Deliberately NOT rendered for the plain "filter" target: there the
  subject alone is already what gets processed, and this chart would just be visual noise on top of
  it.
*/
export const TestChart = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.5;
  mix-blend-mode: overlay;
  background-image: repeating-radial-gradient(circle at 50% 50%, white 0, white 0.0625rem, transparent 0.0625rem, transparent 1.25rem),
    repeating-linear-gradient(to right, white 0, white 0.0625rem, transparent 0.0625rem, transparent 2rem),
    repeating-linear-gradient(to bottom, white 0, white 0.0625rem, transparent 0.0625rem, transparent 2rem);
  pointer-events: none;
`;

// "backdropFilter" target: a translucent panel floating over the stage — its own background is a color-mix of panelColor/panelOpacity (set inline), and backdrop-filter is what makes whatever's visible through that translucency (the stage's own background AND TestChart, both painted behind this panel) read as frosted glass.
export const GlassPanel = styled.div`
  position: relative;
  z-index: 1;
  inline-size: 65%;
  block-size: 55%;
  border-radius: 0.5rem;
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-on-emphasis) 30%, transparent);
`;

/*
  One L-shaped autofocus-style corner bracket. `mix-blend-mode: difference` against a white border
  keeps it legible over any subject color (gradient or photo) without needing a fixed dark backing
  plate — the same "decorative overlay atop dynamic preview content" exception PreviewPane's own
  gradient/photo swatch already relies on elsewhere in these tools, applied here to a HUD reticle
  instead of a filled surface. Sits in ViewfinderFrame (a sibling of Stage), not inside Stage itself,
  so the "filter" target's own compiled filter — e.g. blur or grayscale — never touches the
  reticle, exactly like a real viewfinder overlay is never affected by a lens filter screwed onto
  the lens in front of it.
*/
export const Bracket = styled.span`
  position: absolute;
  inline-size: 1.125rem;
  block-size: 1.125rem;
  border-style: solid;
  border-color: white;
  border-width: 0;
  mix-blend-mode: difference;
  pointer-events: none;

  &[data-corner="tl"] {
    inset-block-start: 0.5rem;
    inset-inline-start: 0.5rem;
    border-block-start-width: 0.1875rem;
    border-inline-start-width: 0.1875rem;
  }

  &[data-corner="tr"] {
    inset-block-start: 0.5rem;
    inset-inline-end: 0.5rem;
    border-block-start-width: 0.1875rem;
    border-inline-end-width: 0.1875rem;
  }

  &[data-corner="bl"] {
    inset-block-end: 0.5rem;
    inset-inline-start: 0.5rem;
    border-block-end-width: 0.1875rem;
    border-inline-start-width: 0.1875rem;
  }

  &[data-corner="br"] {
    inset-block-end: 0.5rem;
    inset-inline-end: 0.5rem;
    border-block-end-width: 0.1875rem;
    border-inline-end-width: 0.1875rem;
  }
`;

/*
  Small exposure-style HUD readout in the corner, reporting the target property and how many lenses
  are currently in the light path — a fixed near-black chip with white text rather than theme tokens,
  the same reasoning as Bracket above: it has to stay legible pinned over an arbitrary,
  user-controlled subject image rather than adapt to the site's own light/dark/soft-dark theme.
*/
export const ExposureReadout = styled.div`
  position: absolute;
  inset-block-end: 0.5rem;
  inset-inline-start: 0.5rem;
  padding: 0.1875rem 0.4375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: white;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 0.1875rem;
  pointer-events: none;
`;
