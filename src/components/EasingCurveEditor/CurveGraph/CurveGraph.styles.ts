import { styled } from "@linaria/react";

export const GraphWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

// Dashed construction line from an anchor to its control-point handle.
export const GuideLine = styled.line`
  stroke: var(--color-fg-muted);
  stroke-width: 2px;
  stroke-dasharray: 4 4;
  opacity: 0.6;
`;

// A draggable control-point handle.
export const Handle = styled.circle`
  fill: var(--color-bg-accent-emphasis);
  stroke: var(--color-bg-default);
  stroke-width: 2px;
  cursor: grab;
  pointer-events: auto;

  &:active {
    cursor: grabbing;
  }
`;

export const ReadoutRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;

  &[data-selected="true"] {
    color: var(--color-fg-accent);
    border-color: var(--color-fg-accent);
  }
`;

export const ReadoutList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;
