import { styled } from "@linaria/react";

/*
  "Cutting Mat" shell — a rotary-cutter's self-healing mat, distinct from every other goodie's
  shell (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench,
  Clay Studio, Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet). Diagonal 45° guide lines
  cross an orthogonal grid the way they're printed on a real mat, in the theme's own danger token
  rather than a raw craft-mat green/yellow, so it stays correct across light/dark/soft-dark — a
  literal callback to "cutting" a shape out of a path, and diagonal rather than Blueprint Grid's
  orthogonal-only hairlines or Ledger Sheet's horizontal-only row-bands.
*/
export const CuttingMat = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background-color: color-mix(in srgb, var(--color-fg-danger) 5%, var(--color-bg-muted));
  background-image: repeating-linear-gradient(
      45deg,
      color-mix(in srgb, var(--color-fg-danger) 10%, transparent) 0,
      color-mix(in srgb, var(--color-fg-danger) 10%, transparent) 0.0625rem,
      transparent 0.0625rem,
      transparent 1.5rem
    ),
    repeating-linear-gradient(
      -45deg,
      color-mix(in srgb, var(--color-fg-danger) 10%, transparent) 0,
      color-mix(in srgb, var(--color-fg-danger) 10%, transparent) 0.0625rem,
      transparent 0.0625rem,
      transparent 1.5rem
    );
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.75rem;
  box-shadow: inset 0 0 0 0.25rem color-mix(in srgb, var(--color-bg-default) 60%, transparent);
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
  border: 0.0625rem dashed var(--color-border-muted);
  border-radius: 0.375rem;
  background: color-mix(in srgb, var(--color-bg-default) 85%, transparent);
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease, transform 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-danger);
    background: color-mix(in srgb, var(--color-fg-danger) 12%, transparent);
    border-color: color-mix(in srgb, var(--color-fg-danger) 45%, transparent);
    border-style: solid;
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
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

// A "cut piece" resting on the mat — a solid card with a notched top-right corner, as if snipped off with scissors.
export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  clip-path: polygon(0 0, calc(100% - 0.75rem) 0, 100% 0.75rem, 100% 100%, 0 100%);
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-fg-danger);
`;
