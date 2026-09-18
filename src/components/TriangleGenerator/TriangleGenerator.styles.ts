import { styled } from "@linaria/react";

/*
  "Drafting Compass" shell — a geometry-class chalkboard, distinct from every other goodie's shell
  (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench, Clay
  Studio, Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light Table,
  Oscilloscope, Mixing Bench, Type Specimen). Protractor-style degree spokes and concentric arcs
  fan out from a fixed pivot in the bottom-left corner — the construction lines you'd draw with an
  actual compass and protractor to build a triangle from angles — rendered in chalk-amber against
  a deep chalkboard-green background. The rings are static, not spinning, so this reads as a
  drawing already made rather than Docking Bay's live radar sweep.
*/
export const DraftingCompass = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background-color: color-mix(in srgb, var(--color-fg-success) 10%, black);
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-attention) 25%, var(--color-border-muted));
  border-radius: 0.75rem;
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset-block-end: -14rem;
    inset-inline-start: -14rem;
    inline-size: 28rem;
    block-size: 28rem;
    background: conic-gradient(
      from -90deg at 100% 0%,
      color-mix(in srgb, var(--color-fg-attention) 14%, transparent) 0deg,
      transparent 1.2deg 13.8deg,
      color-mix(in srgb, var(--color-fg-attention) 14%, transparent) 15deg,
      transparent 16.2deg 28.8deg,
      color-mix(in srgb, var(--color-fg-attention) 14%, transparent) 30deg,
      transparent 31.2deg 43.8deg,
      color-mix(in srgb, var(--color-fg-attention) 14%, transparent) 45deg,
      transparent 46.2deg 90deg
    );
    z-index: -2;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset-block-end: -14rem;
    inset-inline-start: -14rem;
    inline-size: 28rem;
    block-size: 28rem;
    background: repeating-radial-gradient(
      circle at 100% 0%,
      transparent 0,
      transparent 5.5rem,
      color-mix(in srgb, var(--color-fg-attention) 10%, transparent) 5.5rem,
      color-mix(in srgb, var(--color-fg-attention) 10%, transparent) 5.625rem
    );
    z-index: -1;
    pointer-events: none;
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
  border: 0.0625rem dashed color-mix(in srgb, var(--color-fg-attention) 40%, transparent);
  border-radius: 50%;
  background: transparent;
  color: color-mix(in srgb, var(--color-fg-attention) 70%, var(--color-fg-muted));
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-attention);
    background: color-mix(in srgb, var(--color-fg-attention) 14%, transparent);
    border-color: var(--color-fg-attention);
    border-style: solid;
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

// A "chalked-in" panel — dashed border like it was sketched with a straightedge, not printed.
export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: color-mix(in srgb, var(--color-fg-success) 6%, var(--color-bg-default));
  border: 0.0625rem dashed color-mix(in srgb, var(--color-fg-attention) 30%, var(--color-border-muted));
  border-radius: 0.5rem;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-fg-attention);
`;
