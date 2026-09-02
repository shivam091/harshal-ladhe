import { styled } from "@linaria/react";

/*
  The bounded stage — its background-image is set inline per-render (either the vivid reference
  gradient or one of the site's own photos). For the "filter" target, `filter` is applied directly
  to this same element (it processes whatever the element itself renders, its background included)
  rather than a separate overlay — there's nothing else behind it to distinguish from the thing
  being filtered, unlike backdrop-filter's GlassPanel below.
*/
export const PreviewStage = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  max-inline-size: 40rem;
  margin-inline: auto;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

// "backdropFilter" target: a translucent card floating over the stage — its own background is a color-mix of panelColor/panelOpacity (set inline), and backdrop-filter is what makes whatever's visible through that translucency (the stage's own background, painted behind this panel) read as frosted glass. Needs no background-image of its own — backdrop-filter samples whatever already renders behind it.
export const GlassPanel = styled.div`
  inline-size: 65%;
  block-size: 55%;
  border-radius: 1rem;
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-on-emphasis) 30%, transparent);
`;
