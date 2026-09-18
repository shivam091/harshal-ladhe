import { styled } from "@linaria/react";

const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  "Terminal Split" shell — a compiler's two-pane terminal, distinct from every other goodie's
  shell (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench,
  Clay Studio, Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light Table,
  Oscilloscope, Mixing Bench, Type Specimen, Drafting Compass). A horizontal wash runs from the
  theme's attention token (JSON's side) to its accent token (TS's side), meeting at a glowing
  center seam — a direct visual echo of "bidirectional conversion" rather than a neutral backdrop.
  Monospace throughout, since both halves of this tool are source text.
*/
export const TerminalSplit = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background:
    linear-gradient(
      to right,
      color-mix(in srgb, var(--color-fg-attention) 9%, black) 0%,
      color-mix(in srgb, black 18%, var(--color-bg-default)) 48%,
      color-mix(in srgb, black 18%, var(--color-bg-default)) 52%,
      color-mix(in srgb, var(--color-fg-accent) 9%, black) 100%
    );
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.625rem;
  font-family: ${MONO_FONT};

  &::before {
    content: "";
    position: absolute;
    inset-block: 0;
    inset-inline-start: 50%;
    inline-size: 0.0625rem;
    translate: -50% 0;
    background: linear-gradient(
      to bottom,
      transparent,
      color-mix(in srgb, var(--color-fg-attention) 50%, var(--color-fg-accent) 50%),
      transparent
    );
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const ToolbarRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// A blinking terminal cursor before the toolbar controls — switched off entirely under prefers-reduced-motion.
export const PromptCursor = styled.span`
  display: inline-flex;
  align-items: center;
  font-family: ${MONO_FONT};
  font-weight: 700;
  color: color-mix(in srgb, var(--color-fg-attention) 50%, var(--color-fg-accent) 50%);
  margin-inline-end: 0.25rem;

  &::after {
    content: "_";
    animation: terminal-blink 1.1s step-end infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }

  @keyframes terminal-blink {
    50% {
      opacity: 0;
    }
  }
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
  background: color-mix(in srgb, black 20%, transparent);
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
    background: color-mix(in srgb, var(--color-fg-default) 10%, transparent);
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

export const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: color-mix(in srgb, black 12%, var(--color-bg-muted));
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--color-fg-muted);

  &::before {
    content: "// ";
    color: color-mix(in srgb, var(--color-fg-muted) 55%, transparent);
  }
`;
