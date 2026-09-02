import { styled } from "@linaria/react";

// Square drag surface for a radial/conic gradient's center — a checkerboard-free flat card is enough context here since PreviewPane right beside it already shows the real gradient.
export const PadStage = styled.div`
  position: relative;
  inline-size: 8rem;
  block-size: 8rem;
  margin-inline: auto;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: crosshair;
  touch-action: none;
`;

// Crosshair guide lines through the current position — helps judge "how far from center" at a glance, the same way a design tool's alignment guides do.
export const PadGuideX = styled.div`
  position: absolute;
  inset-inline: 0;
  block-size: 0.0625rem;
  background: var(--color-border-muted);
  pointer-events: none;
`;

export const PadGuideY = styled.div`
  position: absolute;
  inset-block: 0;
  inline-size: 0.0625rem;
  background: var(--color-border-muted);
  pointer-events: none;
`;

export const PadHandle = styled.div`
  position: absolute;
  inline-size: 0.875rem;
  block-size: 0.875rem;
  transform: translate(-50%, -50%);
  background: var(--color-bg-accent-emphasis);
  border: 0.125rem solid var(--color-bg-default);
  border-radius: 50%;
  box-shadow: 0 0 0 0.0625rem var(--color-border-muted);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;
