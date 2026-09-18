import { styled } from "@linaria/react";

/*
  "Oscilloscope" shell — a CRT scope screen, distinct from every other goodie's shell (Console,
  Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench, Clay Studio,
  Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light Table). A near-black
  screen with drifting horizontal scanlines and a vignette darkening the corners, the way a curve
  actually gets read on real lab equipment — apt for a tool whose whole job is plotting a motion
  trace over time. The phosphor-green accent comes from color-mixing the theme's own success token
  rather than a raw hex, so it stays correct across light/dark/soft-dark. Scanline drift is
  switched off under prefers-reduced-motion.
*/
export const Oscilloscope = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background: radial-gradient(ellipse 90% 80% at 50% 40%, color-mix(in srgb, var(--color-bg-default) 92%, black), color-mix(in srgb, var(--color-bg-default) 75%, black));
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-success) 30%, var(--color-border-muted));
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: inset 0 0 2.5rem 0.5rem color-mix(in srgb, black 45%, transparent);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-fg-success) 5%, transparent) 0,
      color-mix(in srgb, var(--color-fg-success) 5%, transparent) 0.0625rem,
      transparent 0.0625rem,
      transparent 0.25rem
    );
    background-size: 100% 0.5rem;
    animation: oscilloscope-drift 6s linear infinite;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }

  @keyframes oscilloscope-drift {
    to {
      background-position: 0 1rem;
    }
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
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-success) 25%, var(--color-border-muted));
  border-radius: 0.25rem;
  background: color-mix(in srgb, black 15%, transparent);
  color: color-mix(in srgb, var(--color-fg-success) 65%, var(--color-fg-muted));
  cursor: pointer;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease, box-shadow 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-success);
    background: color-mix(in srgb, var(--color-fg-success) 14%, transparent);
    border-color: var(--color-fg-success);
    box-shadow: 0 0 0.625rem 0 color-mix(in srgb, var(--color-fg-success) 55%, transparent);
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

// A readout panel bolted to the scope chassis — near-black glass with a hairline phosphor-green edge.
export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: color-mix(in srgb, black 20%, var(--color-bg-muted));
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-success) 18%, var(--color-border-muted));
  border-radius: 0.375rem;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-fg-success);
  text-shadow: 0 0 0.5rem color-mix(in srgb, var(--color-fg-success) 60%, transparent);
`;
