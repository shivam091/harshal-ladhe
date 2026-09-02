import { styled } from "@linaria/react";

// Side-by-side when a type needs both an angle dial and a position pad (conic only) — stacks on narrow side panels.
export const GeometryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;
