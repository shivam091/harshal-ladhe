import { styled } from "@linaria/react";

/*
  The worktable the clay lump rests on — its own background is set inline per-render to
  state.pageColor, matching BoxShadowGenerator's own page/surface split. A soft radial highlight
  standing in for an overhead studio lamp reinforces the "lit from above" read the lump's own
  ambient shadow (ClayLump's filter) depends on for a believable "resting object" illusion.
*/
export const WorkSurface = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  max-inline-size: 40rem;
  margin-inline: auto;
  overflow: hidden;
  border-radius: 1.25rem;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% -10%, color-mix(in srgb, white 22%, transparent), transparent 60%);
    pointer-events: none;
  }
`;

/*
  The lump of clay itself — square (matching compileSquirclePath's own square-box assumption) and
  sized as a fraction of the worktable rather than filling it, so there's room around every edge for
  RadiusOverlay's pinch-point handles to sit without clipping against the table's own bounds.

  The double drop-shadow (rather than a plain box-shadow) is what makes this read as a physical
  object rather than a flat CSS demo box: `filter: drop-shadow` renders against the element's
  actual painted silhouette — border-radius OR clip-path, whichever the current family compiles
  to — so the shadow always hugs the true shape (a squircle casts a squircle-shaped shadow, not a
  square one a plain box-shadow would produce). A tight, dark near shadow reads as contact with the
  worktable; a soft, wide far shadow reads as the lump lifting slightly off it under overhead light.
  The inset highlight/shade pair is a wet-clay sheen — literal white/black, the same "decorative
  preview subject" exception every other goodie's own swatch already relies on (e.g. FilterGenerator
  PreviewPane's ExposureReadout), since it has to read as a light source hitting an arbitrary
  user-picked clay color rather than adapt to the site's own theme tokens.
*/
export const ClayLump = styled.div`
  position: relative;
  block-size: 62%;
  aspect-ratio: 1 / 1;
  box-shadow: inset 0 0.1875rem 0.375rem rgba(255, 255, 255, 0.4), inset 0 -0.25rem 0.5rem rgba(0, 0, 0, 0.14);
  filter: drop-shadow(0 0.1875rem 0.1875rem rgba(0, 0, 0, 0.22)) drop-shadow(0 0.875rem 1.25rem rgba(0, 0, 0, 0.18));
  transition: filter 200ms ease;
`;
