import { styled } from "@linaria/react";

/*
  "Ledger Sheet" shell — an accountant's ruled ledger page rather than a drafting grid, distinct
  from every other goodie's shell (Console, Annotation Desk, Elevation Stack, Live Canvas,
  Editorial Stage, Optics Bench, Clay Studio, Blueprint Grid, Swatch Fan, Docking Bay). Faint
  horizontal row-bands stand in for ruled ledger lines and a red margin rule runs down the left
  edge, the way real ledger paper is printed — a callback to "rows and columns" that reads as
  paper-and-ink rather than Blueprint Grid's cool hairline drafting mesh or Docking Bay's radar
  rings. The warm ivory wash comes from color-mixing the theme's own attention token into
  bg-muted, never a raw hex, so it stays correct across light/dark/soft-dark.
*/
export const Ledger = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  padding-inline-start: clamp(1.75rem, 4vw, 2.75rem);
  background-color: color-mix(in srgb, var(--color-fg-attention) 4%, var(--color-bg-muted));
  background-image: repeating-linear-gradient(
    to bottom,
    color-mix(in srgb, var(--color-fg-attention) 6%, transparent) 0,
    color-mix(in srgb, var(--color-fg-attention) 6%, transparent) 0.0625rem,
    transparent 0.0625rem,
    transparent 1.875rem
  );
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset-block: 0;
    inset-inline-start: clamp(1.125rem, 2.5vw, 1.75rem);
    inline-size: 0.09375rem;
    background: color-mix(in srgb, var(--color-fg-danger) 55%, transparent);
  }
`;

export const ToolbarRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const ToolbarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  background: color-mix(in srgb, var(--color-bg-default) 80%, transparent);
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease, transform 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-success);
    background: color-mix(in srgb, var(--color-fg-success) 12%, transparent);
    border-color: color-mix(in srgb, var(--color-fg-success) 40%, transparent);
    transform: translateY(-0.0625rem);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const GeneratorGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: 20rem minmax(0, 1fr);
    align-items: start;
  }
`;

export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// A "line item" card — a crisp white-ish ticket sitting on top of the ruled page, the way a pasted-in receipt sits on a ledger sheet.
export const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: color-mix(in srgb, var(--color-bg-default) 92%, transparent);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  box-shadow: var(--box-shadow-xs);
`;

export const PanelTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-fg-success);

  &::before {
    content: "";
    inline-size: 0.5rem;
    block-size: 0.5rem;
    border: 0.09375rem solid currentColor;
    border-radius: 0.125rem;
  }
`;
