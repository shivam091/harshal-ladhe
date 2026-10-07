import { styled } from "@linaria/react";

// Monospace for every `d` string and numeric readout — path data is unreadable in a proportional face.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// An old-book serif for titles and labels — the one typographic cue that the bench is a workshop, not a dashboard.
export const SERIF_FONT = "'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif";

/*
  "Alchemist's Workbench" shell — distinct from every other goodie's shell (Arcade Cabinet,
  Railway Signal Box, Corkboard, Dope Sheet, Circuit Board, Blueprint, Ledger and the rest). A
  lamplit oak bench with brass rivets at its corners: keyframes sit in glass flasks, the morph
  happens in a central alembic over a small flame, the timeline is a brass astrolabe, and code
  is written on parchment labels. Every colour is a warm color-mix of the theme's attention,
  danger and accent tokens over its own background, so the bench re-stains itself for light,
  dark and soft-dark. The --bench-* tokens declared here are inherited by every panel inside.
*/
export const Workbench = styled.div`
  --bench-brass: color-mix(in oklab, var(--color-fg-attention) 78%, var(--color-fg-danger));
  --bench-brass-light: color-mix(in oklab, var(--bench-brass) 60%, white);
  --bench-brass-deep: color-mix(in oklab, var(--bench-brass) 55%, black);
  --bench-wood: color-mix(in oklab, var(--color-fg-attention) 16%, var(--color-bg-default));
  --bench-wood-dark: color-mix(in oklab, var(--color-fg-attention) 32%, color-mix(in oklab, var(--color-bg-default) 55%, black));
  --bench-parchment: color-mix(in oklab, var(--color-fg-attention) 9%, var(--color-bg-default));
  --bench-parchment-edge: color-mix(in oklab, var(--color-fg-attention) 38%, var(--color-bg-default));
  --bench-ink: color-mix(in oklab, var(--color-fg-default) 85%, var(--color-fg-danger));
  --bench-glass: color-mix(in oklab, var(--color-fg-accent) 10%, transparent);
  --bench-glass-edge: color-mix(in oklab, var(--color-fg-accent) 40%, var(--color-fg-muted));
  --bench-wax: color-mix(in oklab, var(--color-fg-danger) 82%, black);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  color: var(--color-fg-default);
  background:
    radial-gradient(circle at 0.875rem 0.875rem, var(--bench-brass-light) 0 0.1875rem, var(--bench-brass-deep) 0.25rem 0.3125rem, transparent 0.34rem),
    radial-gradient(circle at calc(100% - 0.875rem) 0.875rem, var(--bench-brass-light) 0 0.1875rem, var(--bench-brass-deep) 0.25rem 0.3125rem, transparent 0.34rem),
    radial-gradient(circle at 0.875rem calc(100% - 0.875rem), var(--bench-brass-light) 0 0.1875rem, var(--bench-brass-deep) 0.25rem 0.3125rem, transparent 0.34rem),
    radial-gradient(circle at calc(100% - 0.875rem) calc(100% - 0.875rem), var(--bench-brass-light) 0 0.1875rem, var(--bench-brass-deep) 0.25rem 0.3125rem, transparent 0.34rem),
    radial-gradient(ellipse 70% 40% at 50% 0%, color-mix(in oklab, var(--color-fg-attention) 22%, transparent), transparent),
    repeating-linear-gradient(
      91deg,
      transparent 0 0.9rem,
      color-mix(in oklab, var(--bench-wood-dark) 14%, transparent) 0.9rem 0.95rem,
      transparent 0.95rem 2.3rem,
      color-mix(in oklab, var(--bench-wood-dark) 9%, transparent) 2.3rem 2.42rem
    ),
    var(--bench-wood);
  border: 0.3125rem solid var(--bench-wood-dark);
  border-radius: 0.75rem;
  box-shadow:
    inset 0 0 0 0.0625rem color-mix(in oklab, var(--bench-brass) 30%, transparent),
    inset 0 0.5rem 1.5rem -0.75rem color-mix(in oklab, black 35%, transparent),
    0 0.75rem 1.5rem -0.75rem color-mix(in oklab, black 45%, transparent);
`;

// The bench's header: an engraved brass nameplate on the left, the toolbar of brass knobs on the right.
export const BenchHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

// The engraved nameplate — a brass gradient with an inset bevel, lettered in small caps like a maker's mark.
export const Nameplate = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 1rem;
  font-family: ${SERIF_FONT};
  font-size: clamp(0.95rem, 2.4vw, 1.2rem);
  font-weight: 700;
  font-variant: small-caps;
  letter-spacing: 0.08em;
  color: color-mix(in oklab, var(--bench-brass-deep) 70%, black);
  background: linear-gradient(170deg, var(--bench-brass-light), var(--bench-brass) 55%, var(--bench-brass-deep));
  border-radius: 0.25rem;
  box-shadow:
    inset 0 0.0625rem 0 color-mix(in oklab, white 45%, transparent),
    inset 0 -0.0625rem 0 color-mix(in oklab, black 35%, transparent),
    0 0.125rem 0.25rem color-mix(in oklab, black 30%, transparent);
  text-shadow: 0 0.0625rem 0 color-mix(in oklab, white 35%, transparent);
`;

// The toolbar's row of knobs; wraps under the nameplate on phones rather than squeezing.
export const ToolbarRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
`;

/*
  A turned brass knob — every discrete action on the bench uses one, so the controls read as the
  same set of fittings. Pressed knobs (aria-pressed) sink into the wood instead of changing colour.
*/
export const BrassButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-block-size: 2.25rem;
  min-inline-size: 2.25rem;
  padding: 0 0.75rem;
  font-family: ${SERIF_FONT};
  font-size: 0.8125rem;
  font-weight: 700;
  color: color-mix(in oklab, var(--bench-brass-deep) 75%, black);
  background: radial-gradient(circle at 35% 30%, var(--bench-brass-light), var(--bench-brass) 60%, var(--bench-brass-deep));
  border: 0.0625rem solid var(--bench-brass-deep);
  border-radius: 999px;
  box-shadow:
    inset 0 0.0625rem 0 color-mix(in oklab, white 40%, transparent),
    0 0.125rem 0 color-mix(in oklab, black 35%, transparent);
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 100ms ease, filter 150ms ease;

  &:hover:not(:disabled) {
    filter: brightness(1.08);
  }

  &:active:not(:disabled),
  &[aria-pressed="true"] {
    transform: translateY(0.0625rem);
    box-shadow: inset 0 0.125rem 0.25rem color-mix(in oklab, black 35%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

// Two-column working area below the bench top — parchment labels on one side, the alchemist's notes on the other.
export const WorkGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 56rem) {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    align-items: start;
  }
`;

// A column stack inside WorkGrid.
export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// Presets and sharing along the bottom edge of the bench, like a shelf under the worktop.
export const TrayRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 48rem) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    align-items: start;
  }
`;

/*
  A parchment sheet pinned to the bench — warm paper with a darker, foxed edge (an inset radial
  vignette) and a soft drop shadow, so every panel reads as paper resting on wood.
*/
export const ParchmentCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  color: var(--bench-ink);
  background:
    radial-gradient(ellipse at 50% 50%, transparent 55%, color-mix(in oklab, var(--bench-parchment-edge) 45%, transparent) 100%),
    var(--bench-parchment);
  border: 0.0625rem solid color-mix(in oklab, var(--bench-parchment-edge) 70%, transparent);
  border-radius: 0.25rem 0.5rem 0.375rem 0.625rem;
  box-shadow: 0 0.25rem 0.75rem -0.25rem color-mix(in oklab, black 35%, transparent);
`;

// Panel heading inked in the serif with a red wax seal before it — the bench's equivalent of a section stamp.
export const PanelTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-family: ${SERIF_FONT};
  font-size: 1rem;
  font-weight: 700;
  font-variant: small-caps;
  letter-spacing: 0.04em;
  color: var(--bench-ink);

  &::before {
    content: "";
    flex: 0 0 auto;
    inline-size: 0.75rem;
    block-size: 0.75rem;
    border-radius: 50% 45% 55% 50%;
    background: radial-gradient(circle at 35% 35%, color-mix(in oklab, var(--bench-wax) 60%, white), var(--bench-wax) 60%);
    box-shadow: 0 0.0625rem 0.125rem color-mix(in oklab, black 40%, transparent);
  }
`;

// Small explanatory copy inside a panel — one shared style rather than inline style objects everywhere.
export const PanelHint = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: color-mix(in oklab, var(--bench-ink) 70%, var(--color-fg-muted));

  & code {
    font-family: ${MONO_FONT};
    font-size: 0.75rem;
  }
`;

// A label + native checkbox pair, laid out in a row — the bench's switches.
export const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--bench-ink);
  cursor: pointer;

  & input {
    inline-size: 1rem;
    block-size: 1rem;
    margin: 0;
    accent-color: var(--bench-brass-deep);
  }
`;

// A wrapping row of related controls.
export const ControlRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
`;
