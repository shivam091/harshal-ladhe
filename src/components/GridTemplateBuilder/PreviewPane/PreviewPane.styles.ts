import { styled } from "@linaria/react";

// Bordered frame around the live grid — a fixed min-height so 1fr row tracks have real space to divide up, the same reasoning every other goodie's own PreviewStage sets one.
export const PreviewStage = styled.div`
  display: flex;
  min-block-size: 20rem;
  padding: 1rem;
  overflow: hidden;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

// The actual live CSS grid — every declaration on it comes straight from compileContainerStyle, so what's on screen here is exactly what the export panel's CSS tab prints, not a hand-tuned approximation of it.
export const Grid = styled.div`
  flex: 1 1 auto;
  min-inline-size: 0;
`;

// One colored placeholder box — either a named area or a numbered auto-placed cell, depending on PreviewPane's own showAreas branch.
export const PlaceholderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: 2.5rem;
  padding: 0.375rem;
  overflow: hidden;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  border-radius: 0.375rem;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
