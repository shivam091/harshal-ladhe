import { styled } from "@linaria/react";

/*
  "Swatch Fan" shell — a crisp print-shop paint-chip reference binder rather than a matte equipment
  chassis (FilterGenerator's Optics Bench), glass (GradientGenerator's Live Canvas), warm desk paper
  (RegexTester's Annotation Desk), a physical card stack (BoxShadowGenerator's Elevation Stack), a
  printed manuscript sheet (TextEffectsGenerator's Editorial Stage), soft modeling clay
  (BorderRadiusGenerator's Clay Studio), or cyanotype drafting paper (LayoutPlayground's Blueprint
  Grid): plain, near-white card stock in light mode and an inked-on-dark sheet in dark/soft-dark,
  with crisp ruling rather than any warmth. Never a raw hex/hsl for chrome — every tone here is
  color-mixed off the theme's own bg/fg tokens so the binder still reads correctly in every theme;
  the swatches it generates are the one deliberate exception, same pattern every other goodie
  already established for its own literal color values.
*/
export const SwatchBook = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1.125rem, 3vw, 1.875rem);
  padding-block-start: clamp(1.75rem, 4vw, 2.5rem);
  background: color-mix(in srgb, var(--color-bg-default) 96%, var(--color-fg-default) 4%);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.875rem;
  box-shadow: var(--box-shadow-sm);
  overflow: hidden;
`;

/*
  Printer's registration mark — a small crosshair-in-circle used to align color separations on a
  real press sheet, repurposed here as a purely decorative corner detail that signals "this surface
  is a printed reference sheet." Rendered twice (top-left/top-right) by RegistrationMark's own two
  instances in the .tsx, distinct from PunchHole below (that's a binder-ring hole, not a press mark).
*/
export const RegistrationMark = styled.svg`
  position: absolute;
  inset-block-start: 0.625rem;
  inline-size: 0.875rem;
  block-size: 0.875rem;
  color: color-mix(in srgb, var(--color-fg-muted) 45%, transparent);
  pointer-events: none;

  &[data-side="left"] {
    inset-inline-start: 0.75rem;
  }

  &[data-side="right"] {
    inset-inline-end: 0.75rem;
  }
`;

/*
  Die-cut hole punch, like the hang-hole at the top of a real paint-store swatch card — this shell's
  own distinguishing structural motif (every other goodie has its own signature shell shape; this is
  this one's). Colored to match the page behind the binder rather than the binder's own card-stock
  tone, so it reads as a genuine cutout rather than a painted dot.
*/
export const PunchHole = styled.span`
  position: absolute;
  inset-block-start: 0.625rem;
  inset-inline-start: 50%;
  transform: translateX(-50%);
  inline-size: 0.75rem;
  block-size: 0.75rem;
  border-radius: 50%;
  background: var(--color-bg-default);
  box-shadow: inset 0 0.0625rem 0.1875rem color-mix(in srgb, var(--color-fg-default) 35%, transparent), 0 0.0625rem 0 color-mix(in srgb, var(--color-fg-on-emphasis) 40%, transparent);
  pointer-events: none;
`;

// Top row of the binder — the tool's own nameplate on the left, the tray of undo/redo/reset stamps on the right.
export const SwatchBookHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

// The binder's own nameplate label — small-caps, wide letter-spacing, evoking a printed cover title rather than a soft rounded wordmark or an engraved console label.
export const SwatchBookTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-fg-default);
`;

// Tray holding undo/redo/reset — a strip of small ink-pad stamps rather than a soft dish or a hard equipment control deck.
export const StampRail = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  background: color-mix(in srgb, var(--color-bg-muted) 92%, var(--color-fg-default) 3%);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

// One stamp in the rail — undo, redo, or reset — square with a slightly rounded corner, like a small rubber stamp block.
export const StampButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: none;
  border-radius: 0.3125rem;
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, transform 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-accent);
    background: color-mix(in srgb, var(--color-fg-accent) 14%, transparent);
  }

  &:active:not(:disabled) {
    transform: scale(0.9) rotate(-2deg);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: color 150ms ease, background 150ms ease;

    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

// The binder laid open — a two-page spread, single column on narrow viewports, side page becoming a sticky rail from 60rem up.
export const Spread = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;

  @media (min-width: 60rem) {
    grid-template-columns: 21rem minmax(0, 1fr);
    align-items: start;
  }
`;

// The book's left-hand page — seed ink, the contrast pair, presets, and the share slip.
export const SidePage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;

  @media (min-width: 60rem) {
    position: sticky;
    inset-block-start: 1rem;
  }
`;

// The book's right-hand page — the QC stamp, the fanned ramp, and the export spec sheet.
export const MainPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;
`;

/*
  Base card every panel below builds on — the "Swatch Fan" counterpart to every other goodie's own
  Panel: a die-cut reference card with one clipped corner (like a swatch card's own trimmed corner)
  rather than a soft pressed slab (Clay Studio), bolted chassis (Optics Bench), or glass pane (Live
  Canvas).
*/
export const Panel = styled.section`
  position: relative;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.625rem;
  box-shadow: var(--box-shadow-sm);
  clip-path: polygon(0 0, calc(100% - 0.875rem) 0, 100% 0.875rem, 100% 100%, 0 100%);
  overflow: hidden;
`;

// A panel's title strip — a ruled band with a bottom border, like a printed card header rather than a soft molded tray.
export const PanelHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: color-mix(in srgb, var(--color-bg-muted) 90%, var(--color-fg-default) 2%);
  border-block-end: 0.0625rem solid var(--color-border-muted);
`;

// A panel's heading text, plus room for a leading icon — small-caps letterpress-style label.
export const PanelTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-fg-muted);
`;

// A panel's padded content area beneath its header.
export const PanelBody = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem;
`;
