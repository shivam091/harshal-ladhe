import { styled } from "@linaria/react";

const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  "Circuit Board" shell — a populated PCB, distinct from every other goodie's shell (Console,
  Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench, Clay Studio,
  Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light Table, Oscilloscope,
  Mixing Bench, Type Specimen, Drafting Compass, Terminal Split). Green solder mask mixed from the
  success token, faint copper pours and a sparse via grid mixed from the attention token, white
  silkscreen in monospace. The board stays dark in both themes (a real PCB doesn't invert), while
  the "components" mounted on it — every SectionCard — follow the theme so their text stays legible.
*/
export const CircuitBoard = styled.div`
  --pcb-mask: color-mix(in srgb, var(--color-fg-success) 34%, color-mix(in srgb, var(--color-bg-default) 12%, black));
  --pcb-copper: color-mix(in srgb, var(--color-fg-attention) 72%, var(--color-fg-danger));
  --pcb-gold: color-mix(in srgb, var(--color-fg-attention) 78%, white);
  --pcb-silkscreen: color-mix(in srgb, white 90%, var(--color-fg-success));

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background:
    radial-gradient(circle, color-mix(in srgb, var(--pcb-copper) 55%, transparent) 0 0.1875rem, color-mix(in srgb, black 60%, var(--pcb-mask)) 0.1875rem 0.3125rem, transparent 0.3125rem) 1.5rem 1.5rem / 6rem 6rem,
    repeating-linear-gradient(90deg, transparent 0 2.9375rem, color-mix(in srgb, var(--pcb-copper) 9%, transparent) 2.9375rem 3rem),
    repeating-linear-gradient(0deg, transparent 0 4.4375rem, color-mix(in srgb, var(--pcb-copper) 7%, transparent) 4.4375rem 4.5rem),
    var(--pcb-mask);
  border: 0.125rem solid color-mix(in srgb, var(--pcb-mask) 70%, black);
  border-radius: 0.75rem;
  box-shadow: inset 0 0 0 0.375rem color-mix(in srgb, var(--pcb-mask) 85%, white), inset 0 0 2rem color-mix(in srgb, black 35%, transparent);
  font-family: ${MONO_FONT};
`;

// The pin-header strip — a black plastic housing the gold toolbar pins sit in, with the board's reference designator printed beside it.
export const ToolbarRow = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
`;

// Silkscreened board name — printed lettering, so it's decorative and hidden from assistive tech at the call site.
export const BoardLabel = styled.span`
  margin-inline-end: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pcb-silkscreen);
`;

// Holds the pins together in one housing, so the undo/redo/reset trio reads as a single header rather than three loose buttons.
export const PinHeader = styled.div`
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: color-mix(in srgb, black 82%, var(--pcb-mask));
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0 color-mix(in srgb, black 50%, transparent);
`;

/*
  A gold pin-header pad: a square of plated gold with a darker drilled centre, shared by toolbar
  buttons and the upload/download controls so every "connector" on the board looks the same.
*/
export const GoldPin = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-inline-size: 2rem;
  block-size: 2rem;
  padding: 0 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  color: color-mix(in srgb, black 80%, var(--pcb-gold));
  background:
    radial-gradient(circle, color-mix(in srgb, var(--pcb-gold) 60%, black) 0 0.25rem, transparent 0.3125rem) center / 100% 100% no-repeat,
    linear-gradient(145deg, color-mix(in srgb, var(--pcb-gold) 85%, white), var(--pcb-gold) 55%, color-mix(in srgb, var(--pcb-gold) 75%, black));
  border: 0.0625rem solid color-mix(in srgb, var(--pcb-gold) 60%, black);
  border-radius: 0.1875rem;
  cursor: pointer;
  transition: filter 150ms ease, translate 150ms ease;

  &:has(svg) {
    background: linear-gradient(145deg, color-mix(in srgb, var(--pcb-gold) 85%, white), var(--pcb-gold) 55%, color-mix(in srgb, var(--pcb-gold) 75%, black));
  }

  &:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  &:active:not(:disabled) {
    translate: 0 0.0625rem;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--pcb-silkscreen);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/*
  Three tracks on wide screens — input components, a narrow trace bus, output components — so
  the copper "wiring" has its own lane between the two halves. Below that it collapses to one
  column and the bus is hidden, since horizontal traces can't connect stacked panels.
*/
export const BoardGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 64rem) {
    grid-template-columns: 21rem 3rem minmax(0, 1fr);
    gap: 0;
    align-items: start;
  }
`;

// The input half of the board — source, toggles, presets and sharing stack in reading order.
export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// The output half — preview first, then the log, then code, so the visual result is what you see first.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

/*
  One mounted component's footprint: a themed card (so its contents stay readable in either
  theme) with a copper outline and four drilled mounting pads in its corners.
*/
export const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0.875rem 0.875rem;
  background:
    radial-gradient(circle, var(--pcb-copper) 0 0.1875rem, transparent 0.21875rem) 0.375rem 0.375rem / 0.5rem 0.5rem no-repeat,
    radial-gradient(circle, var(--pcb-copper) 0 0.1875rem, transparent 0.21875rem) calc(100% - 0.375rem) 0.375rem / 0.5rem 0.5rem no-repeat,
    radial-gradient(circle, var(--pcb-copper) 0 0.1875rem, transparent 0.21875rem) 0.375rem calc(100% - 0.375rem) / 0.5rem 0.5rem no-repeat,
    radial-gradient(circle, var(--pcb-copper) 0 0.1875rem, transparent 0.21875rem) calc(100% - 0.375rem) calc(100% - 0.375rem) / 0.5rem 0.5rem no-repeat,
    var(--color-bg-default);
  border: 0.0625rem solid color-mix(in srgb, var(--pcb-copper) 45%, var(--color-border-muted));
  border-radius: 0.375rem;
  box-shadow: 0 0.1875rem 0 color-mix(in srgb, black 35%, transparent);
`;

// Silkscreen-style heading: the reference designator (J1, U2, …) prints in copper before the label, the way a real board labels each footprint.
export const PanelTitle = styled.h3`
  margin: 0;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-fg-muted);

  &::before {
    content: attr(data-designator) "  ";
    color: var(--pcb-copper);
  }
`;

// Short helper copy under a heading — smaller and muted, matching the other goodies' inline hint text.
export const HintText = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;

/*
  The trace bus between the two columns: one copper trace per props-wiring option, lit when that
  option is on, with a signal pulse running from input pad to output pin. Purely decorative —
  the same information lives in the options panel and the transforms log.
*/
export const TraceBus = styled.div`
  display: none;

  @media (min-width: 64rem) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-self: stretch;
    padding-block: 2rem;
  }
`;

// One trace with a pad at either end; its silkscreen label runs vertically above the line since the lane is too narrow for horizontal text.
export const Trace = styled.div`
  position: relative;
  flex: 1 1 0;
  max-block-size: 9rem;
  min-block-size: 4rem;
  overflow: hidden;
  --trace-colour: color-mix(in srgb, var(--pcb-copper) 28%, var(--pcb-mask));

  &[data-active="true"] {
    --trace-colour: var(--pcb-copper);
  }

  &::before {
    content: "";
    position: absolute;
    inset-inline: 0;
    inset-block-start: 50%;
    block-size: 0.1875rem;
    translate: 0 -50%;
    background:
      radial-gradient(circle, var(--trace-colour) 0 0.3125rem, transparent 0.34375rem) left center / 0.6875rem 0.6875rem no-repeat,
      radial-gradient(circle, var(--trace-colour) 0 0.3125rem, transparent 0.34375rem) right center / 0.6875rem 0.6875rem no-repeat,
      var(--trace-colour);
    overflow: visible;
  }

  &[data-active="true"]::after {
    content: "";
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 0;
    inline-size: 0.5rem;
    block-size: 0.1875rem;
    translate: 0 -50%;
    border-radius: 0.125rem;
    background: color-mix(in srgb, var(--pcb-gold) 50%, white);
    box-shadow: 0 0 0.375rem var(--pcb-gold);
    animation: pcb-signal 2.4s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-active="true"]::after {
      animation: none;
      display: none;
    }
  }

  @keyframes pcb-signal {
    from {
      translate: 0 -50%;
    }
    to {
      translate: 2.5rem -50%;
    }
  }
`;

// Vertical silkscreen lettering for a trace — dimmer when the trace isn't carrying that prop.
export const TraceLabel = styled.span`
  position: absolute;
  inset-inline-start: 50%;
  inset-block-end: calc(50% + 0.5rem);
  translate: -50% 0;
  writing-mode: vertical-rl;
  rotate: 180deg;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  white-space: nowrap;
  color: color-mix(in srgb, var(--pcb-silkscreen) 45%, transparent);

  [data-active="true"] > & {
    color: var(--pcb-silkscreen);
  }
`;
