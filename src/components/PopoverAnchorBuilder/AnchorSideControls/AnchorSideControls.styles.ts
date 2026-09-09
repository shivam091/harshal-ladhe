import { styled } from "@linaria/react";

// 3×3 compass grid — unlike TriangleGenerator's DirectionGrid, the center cell is a real, selectable button here (an anchor side in its own right, not empty space), so all 4 corners are the only spacers.
export const CompassGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 0.25rem;
  max-inline-size: 8rem;
`;

export const CompassButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  font-size: 1rem;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
  }
`;

export const CompassSpacer = styled.div``;
