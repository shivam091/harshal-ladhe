import { styled } from "@linaria/react";

// Bounded stage the gradient fills — same checkerboard-less flat card treatment as ClipPathGenerator's PreviewStage, minus the checkerboard since a gradient (unlike a clip-path cutout) always fills the box opaquely.
export const PreviewStage = styled.div`
  position: relative;
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  max-inline-size: 40rem;
  margin-inline: auto;
  overflow: hidden;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

export const Swatch = styled.div`
  position: absolute;
  inset: 0;
`;
