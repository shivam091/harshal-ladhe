import { styled } from "@linaria/react";

// The "page" the shadow sits on — its own background is set inline per-render to state.pageColor, since neumorphism specifically depends on this being near-identical to the swatch's own surfaceColor.
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

// The shadowed element itself — sized as a fraction of the stage rather than filling it, so an inset shadow's own edges and a raised shadow's cast area both have room to actually show.
export const Swatch = styled.div`
  inline-size: 45%;
  aspect-ratio: 1 / 1;
`;
