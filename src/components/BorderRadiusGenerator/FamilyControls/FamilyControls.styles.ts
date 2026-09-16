import { styled } from "@linaria/react";

// Row of clay-lump swatches — wraps on narrow widths rather than scrolling, since there are only 6.
export const LumpRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

/*
  One quick-shape swatch, styled like a little sample of modeling clay pinched into that family's
  silhouette rather than a plain labeled button — the row as a whole should read as a shelf of clay
  samples in different states of being rounded, not a segmented tab control.
*/
export const LumpButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.4375rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 1rem;
  cursor: pointer;
  transition: border-color 150ms ease, transform 150ms ease, background 150ms ease;

  &:hover {
    border-color: var(--color-fg-accent);
    transform: translateY(-0.0625rem);
  }

  &[data-selected="true"] {
    border-color: var(--color-fg-accent);
    background: color-mix(in srgb, var(--color-fg-accent) 10%, var(--color-bg-muted));
    box-shadow: var(--box-shadow-sm);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: border-color 150ms ease, background 150ms ease;

    &:hover {
      transform: none;
    }
  }
`;

// Fixed-size stage the clay swatch itself sits centered in — every lump button gets the same footprint regardless of whether its own swatch is a wide pill rectangle or a small square, so the row stays evenly aligned.
export const LumpStage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.75rem;
  block-size: 2.125rem;
`;

/*
  The clay sample itself — background is a fixed warm terracotta (a literal, non-token color, same
  exception every other goodie's own preview swatches already rely on: it's the decorative preview
  subject, not chrome, so it can't be themed off bg/fg tokens without losing the "this is clay" read
  in a dark theme). Width/height/border-radius or clip-path are all set inline per shape by
  FamilyControls.tsx, since each family needs a different footprint (e.g. Pill's wide rectangle vs.
  Circle's square) to actually look distinct from its neighbors.
*/
export const LumpSwatch = styled.div`
  background: #c98a63;
  box-shadow: inset 0 0.1875rem 0.25rem rgba(255, 255, 255, 0.35), inset 0 -0.1875rem 0.3125rem rgba(0, 0, 0, 0.12);
`;

// The family's name, printed under its own clay sample.
export const LumpLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

// Row pairing the "uniform corners" checkbox with its label — reuses the shared checkbox/label primitives, just laid out inline rather than stacked.
export const UniformRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
