import { styled } from "@linaria/react";

// One monospace stack for coordinates, tallies and the d string, so every number on the bench reads as measured.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  "Stained-Glass Workshop" shell — a glazier's bench, distinct from every other goodie's shell
  (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench, Clay
  Studio, Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light Table,
  Oscilloscope, Mixing Bench, Type Specimen, Drafting Compass, Terminal Split, Arcade Cabinet,
  Railway Signal Box). The path is leaded came, filled regions are coloured panes lit from behind,
  empty regions are clear reeded glass, the ray is a laser plumb line and crossings are counted in
  glazier's tally marks. The glass palette is declared once here as theme-token mixes — cobalt from
  accent, emerald from success, amber from attention, ruby from danger and violet from danger mixed
  into accent — so every pane re-tints itself for light and dark without a single hex. The came
  follows the foreground colour, so it reads as dark lead on a pale table and bright zinc on a dim one.
*/
export const GlassWorkshop = styled.div`
  --glass-cobalt: var(--color-fg-accent);
  --glass-emerald: var(--color-fg-success);
  --glass-amber: var(--color-fg-attention);
  --glass-ruby: var(--color-fg-danger);
  --glass-violet: color-mix(in oklab, var(--color-fg-danger) 50%, var(--color-fg-accent));
  --came: color-mix(in oklab, var(--color-fg-default) 80%, var(--color-fg-muted));
  --came-heart: color-mix(in oklab, var(--came) 45%, var(--color-bg-default));
  --bench: color-mix(in oklab, var(--color-fg-attention) 9%, var(--color-bg-muted));
  --bench-grain: color-mix(in oklab, var(--color-fg-attention) 16%, transparent);
  --pane-nonzero: color-mix(in oklab, var(--glass-cobalt) 58%, transparent);
  --pane-evenodd: color-mix(in oklab, var(--glass-amber) 64%, transparent);
  --laser: var(--glass-ruby);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: 0 clamp(0.875rem, 3vw, 1.5rem) clamp(1rem, 3vw, 1.5rem);
  background:
    repeating-linear-gradient(94deg, transparent 0 0.9rem, var(--bench-grain) 0.9rem 0.95rem, transparent 0.95rem 2.3rem),
    var(--bench);
  border: 0.375rem solid var(--came);
  border-radius: 0.75rem;
  box-shadow:
    inset 0 0 0 0.125rem var(--came-heart),
    0 0.75rem 1.5rem -0.75rem color-mix(in srgb, black 45%, transparent);
  overflow: hidden;
`;

/*
  Leaded transom across the top: a run of diamond quarries made by two diagonal came lattices over
  a five-colour glass gradient, with the title on a clear-glass cartouche in the middle — the way a
  workshop sign would hang in its own window.
*/
export const Transom = styled.header`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-inline: calc(-1 * clamp(0.875rem, 3vw, 1.5rem));
  padding: 1rem clamp(0.875rem, 3vw, 1.5rem);
  background:
    repeating-linear-gradient(45deg, transparent 0 1.45rem, var(--came) 1.45rem 1.6rem),
    repeating-linear-gradient(-45deg, transparent 0 1.45rem, var(--came) 1.45rem 1.6rem),
    linear-gradient(
      90deg,
      color-mix(in oklab, var(--glass-cobalt) 55%, var(--color-bg-default)),
      color-mix(in oklab, var(--glass-emerald) 55%, var(--color-bg-default)) 25%,
      color-mix(in oklab, var(--glass-amber) 55%, var(--color-bg-default)) 50%,
      color-mix(in oklab, var(--glass-ruby) 50%, var(--color-bg-default)) 75%,
      color-mix(in oklab, var(--glass-violet) 55%, var(--color-bg-default))
    );
  border-block-end: 0.375rem solid var(--came);
`;

// The workshop's name on a clear-glass cartouche, edged in came so it sits in the transom like a pane of its own.
export const TransomTitle = styled.span`
  padding: 0.375rem 0.875rem;
  font-family: ${MONO_FONT};
  font-size: clamp(0.875rem, 2.4vw, 1.125rem);
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-fg-default);
  background: color-mix(in oklab, var(--color-bg-default) 88%, transparent);
  border: 0.1875rem solid var(--came);
  border-radius: 999px;
  box-shadow: inset 0 0 0 0.0625rem var(--came-heart);
`;

// The transom's tool cluster; wraps under the title on phones rather than squeezing the buttons.
export const ToolbarRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
`;

/*
  A bevelled glass jewel framed in came — the bench's one button idiom. Pressed or toggled-on
  states glow amber, like a jewel held up to the light table.
*/
export const JewelButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-block-size: 2.25rem;
  min-inline-size: 2.25rem;
  padding: 0 0.75rem;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-fg-default);
  background:
    linear-gradient(150deg, color-mix(in oklab, white 35%, transparent), transparent 55%),
    color-mix(in oklab, var(--color-bg-default) 85%, var(--glass-cobalt));
  border: 0.1875rem solid var(--came);
  border-radius: 0.5rem;
  box-shadow: inset 0 0 0 0.0625rem var(--came-heart);
  cursor: pointer;
  transition: background-color 150ms ease, transform 100ms ease;

  &:hover:not(:disabled) {
    background:
      linear-gradient(150deg, color-mix(in oklab, white 45%, transparent), transparent 55%),
      color-mix(in oklab, var(--color-bg-default) 70%, var(--glass-cobalt));
  }

  &[aria-pressed="true"] {
    background:
      linear-gradient(150deg, color-mix(in oklab, white 40%, transparent), transparent 55%),
      color-mix(in oklab, var(--color-bg-default) 45%, var(--glass-amber));
  }

  &:active:not(:disabled) {
    transform: translateY(0.0625rem);
  }

  &:focus-visible {
    outline: 0.1875rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

/*
  The light table beside the bench notes on wide screens; stacked on narrow ones, with the table
  first because the panes are the point of the tool.
*/
export const WorkGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 64rem) {
    grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
    align-items: start;
  }
`;

// The light-table column: view controls above, the panes, then the winding legend.
export const TableColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-inline-size: 0;
`;

// The bench-notes column: the ray readout and the path editor.
export const NotesColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// One or two panes side by side; collapses to a single column under ~34rem so each pane stays big enough to drag in.
export const PaneRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.75rem;

  &[data-count="2"] {
    @media (min-width: 34rem) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  &[data-count="1"] {
    max-inline-size: 36rem;
    inline-size: 100%;
    margin-inline: auto;
  }
`;

// Presets and export share a full-width tray under the bench.
export const TrayRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 56rem) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }
`;

// A sheet of cartoon paper pinned to the bench and edged in came — the shared card for every side panel.
export const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: color-mix(in oklab, var(--color-bg-default) 94%, var(--glass-amber));
  border: 0.1875rem solid var(--came);
  border-radius: 0.5rem;
  box-shadow: inset 0 0 0 0.0625rem var(--came-heart);
`;

// Card heading with a small diamond quarry before it, cut from the same glass as the transom.
export const PanelTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-fg-default);

  &::before {
    content: "";
    inline-size: 0.5625rem;
    block-size: 0.5625rem;
    background: linear-gradient(135deg, var(--glass-cobalt), var(--glass-violet));
    border: 0.125rem solid var(--came);
    transform: rotate(45deg);
  }
`;

// Small explanatory copy inside a card.
export const PanelHint = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-fg-muted);

  & code {
    font-family: ${MONO_FONT};
    font-size: 0.75rem;
  }
`;

// A wrapping row of jewel buttons or toggles inside a card.
export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
`;

/*
  Range input restyled as a came rail with a glass bead for a thumb — shared by the ray direction
  and seam sliders so every continuous control on the bench looks the same.
*/
export const RangeInput = styled.input`
  inline-size: 100%;
  accent-color: var(--glass-cobalt);
  appearance: none;
  block-size: 1.5rem;
  background: transparent;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    block-size: 0.375rem;
    background: var(--came);
    border-radius: 999px;
  }

  &::-moz-range-track {
    block-size: 0.375rem;
    background: var(--came);
    border-radius: 999px;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    inline-size: 1.125rem;
    block-size: 1.125rem;
    margin-block-start: -0.375rem;
    background: radial-gradient(circle at 35% 35%, color-mix(in oklab, white 60%, var(--glass-ruby)), var(--glass-ruby));
    border: 0.125rem solid var(--came);
    border-radius: 50%;
  }

  &::-moz-range-thumb {
    inline-size: 1rem;
    block-size: 1rem;
    background: radial-gradient(circle at 35% 35%, color-mix(in oklab, white 60%, var(--glass-ruby)), var(--glass-ruby));
    border: 0.125rem solid var(--came);
    border-radius: 50%;
  }

  &:focus-visible {
    outline: 0.1875rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
    border-radius: 0.25rem;
  }
`;

// Label above a slider with its live value pushed to the far end.
export const FieldLabel = styled.label`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);

  & output {
    font-family: ${MONO_FONT};
    font-weight: 700;
    color: var(--color-fg-muted);
  }
`;
