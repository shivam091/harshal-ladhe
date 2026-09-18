import { styled } from "@linaria/react";

/*
  "Light Table" shell — a backlit tracing table, distinct from every other goodie's shell
  (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench, Clay
  Studio, Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat). A faint checkerboard
  — the universal "this is transparent" pattern from illustration/design tools — sits under a soft
  upward glow, as if the whole tool were printed on tracing paper lit from below, which is exactly
  the surface a pen-tool path gets drawn on. Static, not animated, so it reads calm next to Docking
  Bay's spinning radar sweep.
*/
export const LightTable = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background-color: var(--color-bg-muted);
  background-image: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--color-fg-accent) 10%, transparent), transparent 70%),
    conic-gradient(
      color-mix(in srgb, var(--color-fg-default) 6%, transparent) 90deg,
      transparent 90deg 180deg,
      color-mix(in srgb, var(--color-fg-default) 6%, transparent) 180deg 270deg,
      transparent 270deg
    );
  background-size:
    100% 100%,
    1.25rem 1.25rem;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.75rem;
`;

export const ToolbarRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  background: color-mix(in srgb, var(--color-bg-default) 75%, transparent);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  inline-size: fit-content;
`;

export const ToolbarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: 0.0625rem solid transparent;
  border-radius: 0.375rem;
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-accent);
    background: color-mix(in srgb, var(--color-fg-accent) 12%, transparent);
    border-color: color-mix(in srgb, var(--color-fg-accent) 35%, transparent);
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

// A pane resting on the light table — a slightly frosted card so the checkerboard glow still shows faintly through its edges.
export const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: color-mix(in srgb, var(--color-bg-default) 88%, transparent);
  backdrop-filter: blur(0.25rem);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-fg-accent);
`;
