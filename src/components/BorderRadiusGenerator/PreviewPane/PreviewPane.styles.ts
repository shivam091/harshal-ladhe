import { styled } from "@linaria/react";

// The "page" the shape sits on — its own background is set inline per-render to state.pageColor, matching BoxShadowGenerator's own page/surface split.
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
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

/*
  The shape itself — square (matching compileSquirclePath's own square-box assumption) and sized as
  a fraction of the stage rather than filling it, so there's room around every edge for
  RadiusOverlay's corner handles to sit without clipping against the stage's own bounds. Its
  rendered pixel size is whatever the responsive layout gives it; RadiusOverlay scales drag
  percentages against state.size instead, so radius values stay correct regardless.
*/
export const Swatch = styled.div`
  position: relative;
  block-size: 70%;
  aspect-ratio: 1 / 1;
`;
