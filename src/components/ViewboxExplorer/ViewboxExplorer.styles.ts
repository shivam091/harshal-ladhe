import { styled } from "@linaria/react";

// One monospace stack for every readout, label and number in the darkroom — shared so the timer, readout and export all read as the same equipment.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  "Darkroom Enlarger" shell — distinct from every other goodie's shell (Arcade Cabinet, Console,
  Blueprint Grid, Light Table, Cutting Mat, Signal Box…). A dimmed room washed by a safelight from
  above: the user-space canvas is a negative on a light box, the viewBox is the enlarger's masking
  easel, and the viewport is the print on the baseboard. Every colour is mixed from the theme's own
  tokens — --safelight is danger warmed with a touch of attention, the deep amber-red of a real
  darkroom lamp — so the room re-skins itself for light, dark and soft-dark without a single hex.
*/
export const Darkroom = styled.div`
  --safelight: color-mix(in srgb, var(--color-fg-danger) 82%, var(--color-fg-attention));
  --safelight-soft: color-mix(in srgb, var(--safelight) 18%, transparent);
  --safelight-ink: color-mix(in srgb, var(--safelight) 70%, var(--color-fg-default));
  --room: color-mix(in srgb, var(--color-bg-default) 84%, black);
  --tray: color-mix(in srgb, var(--safelight) 5%, color-mix(in srgb, var(--color-bg-muted) 88%, black));

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding-block: 0 clamp(1rem, 3vw, 1.5rem);
  padding-inline: clamp(0.875rem, 3vw, 1.75rem);
  background:
    radial-gradient(ellipse 70% 18rem at 50% 0, color-mix(in srgb, var(--safelight) 16%, transparent), transparent 70%),
    var(--room);
  border: 0.0625rem solid color-mix(in srgb, var(--safelight) 30%, var(--color-border-default));
  border-radius: 0.75rem;
  box-shadow:
    inset 0 0 3rem color-mix(in srgb, black 22%, transparent),
    0 0.75rem 1.5rem -0.75rem color-mix(in srgb, black 45%, transparent);
`;

/*
  The safelight housing across the top of the room — a lamp glowing in the corner and the title
  stencilled on the door sign beside it. The lamp's slow breathing pulse is switched off under
  prefers-reduced-motion.
*/
export const SafelightHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-inline: calc(-1 * clamp(0.875rem, 3vw, 1.75rem));
  padding: 0.875rem clamp(0.875rem, 3vw, 1.75rem);
  background: linear-gradient(to bottom, color-mix(in srgb, var(--safelight) 22%, var(--room)), color-mix(in srgb, var(--safelight) 6%, var(--room)));
  border-block-end: 0.0625rem solid color-mix(in srgb, var(--safelight) 40%, transparent);
  border-start-start-radius: 0.75rem;
  border-start-end-radius: 0.75rem;
`;

// The title block: a lit lamp followed by the stencilled sign.
export const HeaderSign = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

// The safelight bulb — a hot core inside a wide bloom, breathing slowly like a lamp on a dimmer.
export const Lamp = styled.span`
  inline-size: 1rem;
  block-size: 1rem;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, color-mix(in srgb, var(--safelight) 40%, white), var(--safelight) 60%);
  box-shadow:
    0 0 0.5rem var(--safelight),
    0 0 1.5rem color-mix(in srgb, var(--safelight) 60%, transparent);
  animation: darkroom-safelight 4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @keyframes darkroom-safelight {
    50% {
      box-shadow:
        0 0 0.375rem var(--safelight),
        0 0 0.875rem color-mix(in srgb, var(--safelight) 40%, transparent);
    }
  }
`;

// The stencilled "IN USE" style door sign — tracked-out capitals in safelight ink.
export const HeaderTitle = styled.span`
  font-family: ${MONO_FONT};
  font-size: clamp(0.875rem, 2.4vw, 1.125rem);
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--safelight-ink);
`;

// The toolbar cluster; wraps under the sign on phones rather than squeezing the buttons.
export const ToolbarRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
`;

/*
  Enlarger-timer key — a squat rubber-topped button with a small LED that lights in safelight red
  when pressed or active. Used for every discrete action so the whole control set reads as one
  piece of darkroom kit.
*/
export const TimerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4375rem;
  min-block-size: 2.25rem;
  min-inline-size: 2.25rem;
  padding-block: 0;
  padding-inline: 0.625rem;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-fg-default);
  background: linear-gradient(to bottom, color-mix(in srgb, var(--color-bg-muted) 85%, white), color-mix(in srgb, var(--color-bg-muted) 80%, black));
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 70%, black);
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0 color-mix(in srgb, black 35%, transparent);
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 100ms ease, border-color 150ms ease;

  &[data-led]::before {
    content: "";
    flex: 0 0 auto;
    inline-size: 0.4375rem;
    block-size: 0.4375rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--safelight) 25%, black);
  }

  &[aria-pressed="true"] {
    border-color: var(--safelight);
  }

  &[aria-pressed="true"]::before {
    background: var(--safelight);
    box-shadow: 0 0 0.5rem var(--safelight);
  }

  &:hover:not(:disabled) {
    border-color: color-mix(in srgb, var(--safelight) 60%, var(--color-border-default));
  }

  &:active:not(:disabled) {
    transform: translateY(0.125rem);
    box-shadow: none;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus, var(--color-fg-accent));
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
  Negative beside print on wide viewports, stacked on narrow ones — the light box first, since
  that's where the easel is dragged, with the print immediately under it.
*/
export const BenchGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }
`;

// A column on the bench; min-inline-size 0 keeps a wide SVG from blowing out the grid track.
export const BenchColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// The readout and the negative picker under the bench, side by side where they fit.
export const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 48rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
`;

// Presets, export and sharing as a full-width tray along the bottom.
export const TrayRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
    align-items: start;
  }
`;

// A developing tray — a shallow dish with a raised lip, the darkroom's own idea of a panel.
export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-inline-size: 0;
  padding: 0.875rem;
  background: var(--tray);
  border: 0.0625rem solid color-mix(in srgb, var(--safelight) 18%, var(--color-border-muted));
  border-radius: 0.625rem;
  box-shadow:
    inset 0 0.125rem 0.5rem color-mix(in srgb, black 25%, transparent),
    inset 0 0 0 0.1875rem color-mix(in srgb, var(--color-bg-default) 6%, transparent);
`;

// Panel heading like a label strip on a chemical bottle — tracked capitals behind a short safelight bar.
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
  color: var(--safelight-ink);

  &::before {
    content: "";
    inline-size: 0.75rem;
    block-size: 0.1875rem;
    border-radius: 0.125rem;
    background: var(--safelight);
  }
`;

// Small explanatory copy inside a tray — one shared style instead of repeated inline styles.
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

// A row of small buttons under a panel — wraps freely so nothing overflows on phones.
export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;
