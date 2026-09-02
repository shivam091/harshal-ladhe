import { styled } from "@linaria/react";

// Square SVG stage for the compass dial — bounded so usePointDrag's container-relative percentage math lines up with the dial's own 0-100 coordinate space.
export const DialStage = styled.div`
  position: relative;
  inline-size: 8rem;
  block-size: 8rem;
  margin-inline: auto;
`;

export const DialSvg = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: 100%;
  touch-action: none;
`;

export const DialTrack = styled.circle`
  fill: var(--color-bg-default);
  stroke: var(--color-border-muted);
  stroke-width: 1;
`;

export const DialNeedle = styled.line`
  stroke: var(--color-fg-accent);
  stroke-width: 2;
  stroke-linecap: round;
`;

export const DialHandle = styled.circle`
  fill: var(--color-bg-accent-emphasis);
  stroke: var(--color-bg-default);
  stroke-width: 2;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

// Numeric degrees readout/editor sitting under the dial — lets a user type an exact angle instead of only dragging.
export const DegreesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-block-start: 0.5rem;
`;

export const DegreesInput = styled.input`
  inline-size: 4rem;
  padding: 0.25rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  text-align: center;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

export const DegreesSuffix = styled.span`
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
