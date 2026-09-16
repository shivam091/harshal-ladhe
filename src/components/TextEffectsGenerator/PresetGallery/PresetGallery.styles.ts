import { styled } from "@linaria/react";

// Two-column grid of preset specimen tiles.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
`;

// One preset rendered as a flat type-specimen card — a hairline border and a small caption beneath, closer to a printed type-specimen sheet than BoxShadowGenerator's raised, liftable tile.
export const SpecimenCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  padding: 0;
  background: transparent;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.1875rem;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 150ms ease;

  &:hover {
    border-color: var(--color-fg-default);
  }
`;

// The preset's own "Ag" specimen sample, rendered on its own page color with its own compiled shadow/gradient — a thumbnail that IS the output, not a separate hand-drawn icon standing in for it.
export const SpecimenSample = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 2.75rem;
  font-size: 1.375rem;
  font-weight: 800;
`;

// The preset's caption strip beneath its sample — small caps, matching this theme's other panel-title typography.
export const SpecimenLabel = styled.span`
  padding: 0.3125rem 0.375rem;
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: center;
  color: var(--color-fg-muted);
  background: var(--color-bg-muted);
  border-block-start: 0.0625rem solid var(--color-border-muted);
`;
