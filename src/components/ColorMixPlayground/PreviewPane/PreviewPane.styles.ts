import { styled } from "@linaria/react";

// Bounded stage for the single-ratio result — flatter than GradientGenerator's 16:9 PreviewStage since this is a solid swatch, not a scene.
export const PreviewStage = styled.div`
  position: relative;
  inline-size: 100%;
  block-size: 6rem;
  max-inline-size: 40rem;
  margin-inline: auto;
  overflow: hidden;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

export const ResultSwatch = styled.div`
  position: absolute;
  inset: 0;
`;

export const RampStage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const RampLabel = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

export const CompareGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CompareRow = styled.div`
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr);
  align-items: center;
  gap: 0.5rem;
`;

export const CompareLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

// Reused for both the single selected-space ramp and every row of the compare grid — a plain full-bleed gradient bar; the compare grid's smaller footprint comes from its parent CompareRow's grid track, not a separate modifier here.
export const CompareStrip = styled.div`
  inline-size: 100%;
  block-size: 1.75rem;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
`;
