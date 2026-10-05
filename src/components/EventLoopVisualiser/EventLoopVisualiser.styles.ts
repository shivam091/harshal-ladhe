import { styled } from "@linaria/react";

/*
  "Railway Signal Box" shell — a signalling control panel, distinct from every other goodie's shell
  (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench, Clay
  Studio, Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light Table,
  Oscilloscope, Mixing Bench, Type Specimen, Drafting Compass/Chalkboard, Terminal Split). An
  enamel-green panel with a faint riveted border and a bevelled edge, the way a lever frame's
  illuminated diagram looks in a real box — apt for a tool whose whole job is routing work between
  tracks. Every colour is a color-mix of the theme's own tokens, so the enamel deepens in dark mode
  and lightens to sage in light mode without a single hard-coded hex.
*/
export const SignalBox = styled.div`
  --signal-enamel: color-mix(in oklab, var(--color-fg-success) 20%, var(--color-bg-muted));
  --signal-enamel-deep: color-mix(in oklab, var(--color-fg-success) 12%, var(--color-bg-default));
  --signal-rail: color-mix(in oklab, var(--color-fg-muted) 70%, transparent);
  --signal-plate: color-mix(in oklab, var(--color-fg-default) 8%, var(--signal-enamel-deep));
  --signal-lamp-off: color-mix(in oklab, var(--color-fg-muted) 35%, var(--signal-enamel-deep));
  --signal-mono: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background:
    radial-gradient(circle at 0.75rem 0.75rem, color-mix(in oklab, var(--color-fg-muted) 45%, transparent) 0.1875rem, transparent 0.25rem) 0 0 / 100% 100% no-repeat,
    radial-gradient(circle at calc(100% - 0.75rem) 0.75rem, color-mix(in oklab, var(--color-fg-muted) 45%, transparent) 0.1875rem, transparent 0.25rem) 0 0 / 100% 100% no-repeat,
    linear-gradient(to bottom, color-mix(in oklab, white 6%, var(--signal-enamel)), var(--signal-enamel));
  border: 0.1875rem solid color-mix(in oklab, var(--color-fg-success) 30%, var(--color-border-default));
  border-radius: 0.75rem;
  box-shadow:
    inset 0 0.125rem 0 color-mix(in oklab, white 12%, transparent),
    inset 0 -0.1875rem 0 color-mix(in oklab, black 18%, transparent);
`;

// Nameplate on the left, history buttons on the right — wraps beneath on narrow screens.
export const Deck = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

// The cast nameplate every signal box carries above its frame — raised letters on a dark plate.
export const NamePlate = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  font-family: var(--signal-mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-fg-default);
  background: var(--signal-plate);
  border: 0.0625rem solid color-mix(in oklab, var(--color-fg-success) 35%, var(--color-border-muted));
  border-radius: 0.25rem;
  box-shadow: inset 0 0.0625rem 0 color-mix(in oklab, white 10%, transparent);
`;

// A permanently lit "box switched in" lamp — the panel's one bit of ambient life, and a hint that the diagram is live.
export const PowerLamp = styled.span`
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: var(--color-fg-success);
  box-shadow: 0 0 0.5rem 0.0625rem color-mix(in oklab, var(--color-fg-success) 70%, transparent);
`;

// Groups the undo/redo/reset buttons so they wrap as a unit.
export const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// Small brass-edged push buttons for edit history — kept visually quieter than the playback levers, which are the panel's main controls.
export const ToolbarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: 0.0625rem solid color-mix(in oklab, var(--color-fg-attention) 35%, var(--color-border-muted));
  border-radius: 50%;
  background: var(--signal-plate);
  color: var(--color-fg-default);
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;

  &:hover:not(:disabled) {
    border-color: var(--color-fg-attention);
    background: color-mix(in oklab, var(--color-fg-attention) 14%, var(--signal-plate));
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-attention);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// Single column on a phone; a fixed side column beside a flexible main one once there's room for both.
export const GeneratorGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: minmax(0, 21rem) minmax(0, 1fr);
    align-items: start;
  }
`;

// min-inline-size: 0 lets the code listing scroll inside the column instead of stretching the grid.
export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// Same min-inline-size reset as SidePanel, so long rail-car labels can't widen the layout.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// An inset instrument panel screwed onto the enamel — a darker face so lamps and cars read clearly against it.
export const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-inline-size: 0;
  padding: 0.875rem;
  background: var(--signal-enamel-deep);
  border: 0.0625rem solid color-mix(in oklab, var(--color-fg-success) 25%, var(--color-border-muted));
  border-radius: 0.375rem;
  box-shadow: inset 0 0.125rem 0.375rem color-mix(in oklab, black 14%, transparent);
`;

// Panel headings styled as stamped enamel labels — monospace caps, the way box diagrams label their lines.
export const PanelTitle = styled.h3`
  margin: 0;
  font-family: var(--signal-mono);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-fg-default);
`;

// Supporting copy inside a panel — shared so every card's helper sentence sits at the same size and colour.
export const PanelNote = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
