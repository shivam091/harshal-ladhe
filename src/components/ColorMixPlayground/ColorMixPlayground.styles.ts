import { styled } from "@linaria/react";

/*
  "Mixing Bench" shell — a chemistry bench for blending two colors, distinct from every other
  goodie's shell (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics
  Bench, Clay Studio, Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light
  Table, Oscilloscope). The backdrop is a fixed diagonal wash from the theme's danger token to its
  accent token — two "reagents" bleeding toward each other — and headings are literally colored
  with a live color-mix(in oklch, ...) of those same two tokens, so the chrome itself demonstrates
  the function this tool exists to teach. Panels get a glassy top sheen, like light catching a
  beaker, rather than a flat card border.
*/
export const MixingBench = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-fg-danger) 7%, var(--color-bg-muted)) 0%,
      var(--color-bg-muted) 45%,
      color-mix(in srgb, var(--color-fg-accent) 7%, var(--color-bg-muted)) 100%
    );
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.75rem;
  box-shadow: inset 0 -0.1875rem 0 0 color-mix(in srgb, var(--color-fg-muted) 12%, transparent);
`;

export const ToolbarRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.375rem;
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
  border-radius: 50%;
  background: linear-gradient(160deg, color-mix(in srgb, var(--color-bg-default) 92%, transparent), color-mix(in srgb, var(--color-bg-default) 75%, transparent));
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;

  &:hover:not(:disabled) {
    color: color-mix(in oklch, var(--color-fg-danger) 50%, var(--color-fg-accent) 50%);
    border-color: color-mix(in oklch, var(--color-fg-danger) 40%, var(--color-fg-accent) 40%);
    box-shadow: 0 0.125rem 0.5rem 0 color-mix(in srgb, var(--color-fg-accent) 20%, transparent);
    transform: translateY(-0.0625rem);
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

// A pane on the bench with a glassy top sheen, as if light were catching the front of a beaker.
export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: color-mix(in srgb, var(--color-bg-default) 82%, transparent);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem 0.5rem 1.25rem 1.25rem;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    block-size: 1.5rem;
    background: linear-gradient(to bottom, color-mix(in srgb, var(--color-fg-white) 10%, transparent), transparent);
    pointer-events: none;
  }
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: color-mix(in oklch, var(--color-fg-danger) 50%, var(--color-fg-accent) 50%);
`;
