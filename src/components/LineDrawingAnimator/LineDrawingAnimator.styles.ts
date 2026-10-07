import { styled } from "@linaria/react";

// A copperplate-ish script for the nameplate — system script faces only, so the desk never waits on a web font.
export const SCRIPT_FONT = "'Snell Roundhand', 'Apple Chancery', 'Segoe Script', 'URW Chancery L', 'Brush Script MT', cursive";

// Bookish serif for every label on the desk, so the controls read as engraved stationery rather than app chrome.
export const DESK_FONT = "Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Times New Roman', serif";

// Tabular numerals for timings and lengths — the ledger's figures line up like a bookkeeper's columns.
export const FIGURE_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

/*
  "Fountain-pen Writing Desk" shell — distinct from every other goodie's (Arcade Cabinet, Circuit
  Board, Exposure Sheet, Console, Blueprint Grid and the rest). A warm wooden desktop with a tooled
  leather inlay, a glass ink well and a brass nameplate; the artwork sits on a sheet of cream laid
  paper with deckled edges, the stroke list is an ink-blotter ledger and every control is a brass
  fitting. Tokens are all color-mixed from the theme's attention/accent/success/danger colours over
  its own backgrounds, so the desk re-veneers itself for light and dark. The paper deliberately
  stays pale in both themes (dimmed in dark mode, never inverted), because pasted SVGs are usually
  inked in black and must stay legible on it.
*/
export const WritingDesk = styled.div`
  --ld-brass: color-mix(in srgb, var(--color-fg-attention) 82%, var(--color-fg-default));
  --ld-brass-light: color-mix(in srgb, var(--ld-brass) 55%, white);
  --ld-brass-dark: color-mix(in srgb, var(--ld-brass) 55%, black);
  --ld-wood: color-mix(in srgb, var(--color-fg-attention) 16%, var(--color-bg-muted));
  --ld-wood-grain: color-mix(in srgb, var(--color-fg-attention) 26%, var(--color-bg-muted));
  --ld-leather: color-mix(in srgb, var(--color-fg-success) 12%, var(--color-bg-default));
  --ld-blotter: color-mix(in srgb, var(--color-fg-success) 7%, var(--color-bg-default));
  --ld-margin: color-mix(in srgb, var(--color-fg-danger) 55%, transparent);
  --ld-paper: color-mix(in srgb, var(--color-fg-attention) 9%, color-mix(in srgb, var(--color-bg-default) 18%, white));
  --ld-ink: color-mix(in srgb, var(--color-fg-accent) 42%, black);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  font-family: ${DESK_FONT};
  background:
    repeating-linear-gradient(
      172deg,
      transparent 0 1.1rem,
      color-mix(in srgb, var(--ld-wood-grain) 60%, transparent) 1.1rem 1.18rem,
      transparent 1.18rem 2.9rem,
      color-mix(in srgb, var(--ld-wood-grain) 40%, transparent) 2.9rem 2.95rem
    ),
    var(--ld-wood);
  border: 0.1875rem solid color-mix(in srgb, var(--ld-wood-grain) 70%, black);
  border-radius: 0.75rem;
  box-shadow:
    inset 0 0 0 0.0625rem color-mix(in srgb, white 12%, transparent),
    0 0.875rem 1.75rem -1rem color-mix(in srgb, black 55%, transparent);
`;

// The desk's top rail: ink well and nameplate on one side, the brass toolbar on the other; wraps on phones.
export const DeskHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

// Groups the ink well with the nameplate so they wrap together.
export const HeaderLead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

/*
  A cut-glass ink well seen from above: a faceted rim (conic gradient), a pool of the desk's ink and
  a single highlight. Purely decorative, so it is hidden from assistive tech where it's used.
*/
export const InkWell = styled.span`
  position: relative;
  flex: none;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  border-radius: 50%;
  background:
    radial-gradient(circle at 38% 34%, color-mix(in srgb, white 70%, transparent) 0 0.12rem, transparent 0.2rem),
    radial-gradient(circle, var(--ld-ink) 0 46%, color-mix(in srgb, var(--ld-ink) 60%, black) 52%, transparent 54%),
    conic-gradient(from 20deg, color-mix(in srgb, white 55%, var(--ld-brass)), color-mix(in srgb, white 20%, var(--ld-wood)), color-mix(in srgb, white 60%, var(--ld-brass)), color-mix(in srgb, white 25%, var(--ld-wood)), color-mix(in srgb, white 55%, var(--ld-brass)));
  box-shadow:
    0 0 0 0.1875rem var(--ld-brass-dark),
    0 0.25rem 0.5rem color-mix(in srgb, black 40%, transparent);
`;

// An engraved brass nameplate — sunk letters (an inset shadow) in the script face, screwed on at both ends.
export const Nameplate = styled.span`
  position: relative;
  padding: 0.25rem 1.5rem 0.375rem;
  font-family: ${SCRIPT_FONT};
  font-size: clamp(1.25rem, 3vw, 1.625rem);
  line-height: 1.1;
  color: color-mix(in srgb, var(--ld-brass) 25%, black);
  text-shadow: 0 0.0625rem 0 color-mix(in srgb, white 45%, transparent);
  background: linear-gradient(to bottom, var(--ld-brass-light), var(--ld-brass) 55%, var(--ld-brass-dark));
  border-radius: 0.25rem;
  box-shadow:
    inset 0 0.0625rem 0 color-mix(in srgb, white 50%, transparent),
    0 0.125rem 0.25rem color-mix(in srgb, black 35%, transparent);

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset-block-start: 50%;
    inline-size: 0.375rem;
    block-size: 0.375rem;
    margin-block-start: -0.1875rem;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, var(--ld-brass-light), var(--ld-brass-dark));
    box-shadow: inset 0 0 0 0.0625rem color-mix(in srgb, black 25%, transparent);
  }

  &::before {
    inset-inline-start: 0.5rem;
  }

  &::after {
    inset-inline-end: 0.5rem;
  }
`;

// The toolbar's row of brass fittings.
export const ToolbarRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
`;

/*
  A brass desk fitting used for every discrete action: polished gradient face, a darker bevel
  underneath, and a press-down on :active like a drawer pull giving under the thumb.
*/
export const BrassButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-block-size: 2.25rem;
  min-inline-size: 2.25rem;
  padding: 0 0.75rem;
  font-family: ${DESK_FONT};
  font-size: 0.8125rem;
  font-weight: 700;
  color: color-mix(in srgb, var(--ld-brass) 20%, black);
  background: linear-gradient(to bottom, var(--ld-brass-light), var(--ld-brass) 60%, var(--ld-brass-dark));
  border: 0.0625rem solid var(--ld-brass-dark);
  border-radius: 999px;
  box-shadow:
    inset 0 0.0625rem 0 color-mix(in srgb, white 55%, transparent),
    0 0.125rem 0 color-mix(in srgb, var(--ld-brass-dark) 80%, black);
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 100ms ease, filter 150ms ease;

  &:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  &:active:not(:disabled) {
    transform: translateY(0.125rem);
    box-shadow: inset 0 0.0625rem 0.125rem color-mix(in srgb, black 30%, transparent);
  }

  &[aria-pressed="true"] {
    background: linear-gradient(to top, var(--ld-brass-light), var(--ld-brass) 60%, var(--ld-brass-dark));
    box-shadow: inset 0 0.0625rem 0.1875rem color-mix(in srgb, black 35%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
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
  Paper-and-ledger column beside the fittings column on wide screens; one column on narrow ones,
  where the paper naturally comes first since it leads the DOM.
*/
export const DeskGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;

  @media (min-width: 60rem) {
    grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
    align-items: start;
  }
`;

// One column of the desk — stacks its panels.
export const DeskColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;
`;

/*
  A tooled-leather inlay panel with brass corner protectors (two pseudo-element brackets on
  opposite corners) — the common housing for every panel on the desk.
*/
export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--ld-leather);
  border: 0.0625rem solid color-mix(in srgb, var(--ld-brass) 35%, var(--color-border-default));
  border-radius: 0.375rem;
  outline: 0.0625rem dashed color-mix(in srgb, var(--ld-brass) 45%, transparent);
  outline-offset: -0.4375rem;
  box-shadow: 0 0.25rem 0.75rem -0.5rem color-mix(in srgb, black 45%, transparent);

  &::before,
  &::after {
    content: "";
    position: absolute;
    inline-size: 1rem;
    block-size: 1rem;
    border: 0.1875rem solid var(--ld-brass);
    pointer-events: none;
  }

  &::before {
    inset-block-start: -0.0625rem;
    inset-inline-start: -0.0625rem;
    border-inline-end: none;
    border-block-end: none;
    border-start-start-radius: 0.375rem;
  }

  &::after {
    inset-block-end: -0.0625rem;
    inset-inline-end: -0.0625rem;
    border-inline-start: none;
    border-block-start: none;
    border-end-end-radius: 0.375rem;
  }
`;

// A small engraved brass label naming each panel, like the plate on a desk drawer.
export const PanelTitle = styled.h3`
  align-self: flex-start;
  margin: 0;
  padding: 0.125rem 0.625rem;
  font-family: ${DESK_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  font-variant: small-caps;
  letter-spacing: 0.08em;
  color: color-mix(in srgb, var(--ld-brass) 20%, black);
  background: linear-gradient(to bottom, var(--ld-brass-light), var(--ld-brass));
  border-radius: 0.1875rem;
  box-shadow: inset 0 -0.0625rem 0 var(--ld-brass-dark);
`;

// Small explanatory copy inside a panel.
export const PanelHint = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-fg-muted);

  & code {
    font-family: ${FIGURE_FONT};
    font-size: 0.75rem;
  }
`;

// Presets and sharing under both columns, as a tray along the front edge of the desk.
export const TrayRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;

  @media (min-width: 48rem) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    align-items: start;
  }
`;

/*
  Builds a deckled-edge clip-path: dozens of points per side nudged in and out by overlapping sine
  waves, so the paper's edge looks torn by hand. Deterministic (no randomness) so server and client
  styles always match.
*/
export function deckledEdge(pointsPerSide = 36): string {
  const jitter = (i: number, side: number) => 0.55 + 0.35 * Math.sin(i * 2.3 + side) + 0.25 * Math.sin(i * 5.7 + side * 3);
  const points: string[] = [];
  for (let i = 0; i <= pointsPerSide; i++) points.push(`${((i / pointsPerSide) * 100).toFixed(2)}% ${jitter(i, 1).toFixed(2)}%`);
  for (let i = 0; i <= pointsPerSide; i++) points.push(`${(100 - jitter(i, 2) * 0.7).toFixed(2)}% ${((i / pointsPerSide) * 100).toFixed(2)}%`);
  for (let i = pointsPerSide; i >= 0; i--) points.push(`${((i / pointsPerSide) * 100).toFixed(2)}% ${(100 - jitter(i, 3)).toFixed(2)}%`);
  for (let i = pointsPerSide; i >= 0; i--) points.push(`${(jitter(i, 4) * 0.7).toFixed(2)}% ${((i / pointsPerSide) * 100).toFixed(2)}%`);
  return `polygon(${points.join(", ")})`;
}
