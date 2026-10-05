import { styled } from "@linaria/react";

// One monospace stack for every readout and label in the cabinet — shared so the marquee, gutter and FPS counter all read as the same machine.
export const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  "Arcade Cabinet" shell — an 80s upright cabinet, distinct from every other goodie's shell
  (Console, Annotation Desk, Elevation Stack, Live Canvas, Editorial Stage, Optics Bench, Clay
  Studio, Blueprint Grid, Swatch Fan, Docking Bay, Ledger Sheet, Cutting Mat, Light Table,
  Oscilloscope, Mixing Bench, Type Specimen, Drafting Compass, Terminal Split). A dark laminate
  body with diagonal side-art stripes running down both flanks, a backlit marquee on top and the
  canvas framed as a CRT behind a bezel — a shader toy is, after all, a machine for making pixels
  glow. Every colour is a color-mix of the theme's danger/accent/attention tokens over its own
  background, so the cabinet re-skins itself for light, dark and soft-dark without a single hex.
  --cabinet-neon (danger mixed into accent, an arcade magenta-violet) is declared here and
  inherited by every panel inside, since the theme has no purple token of its own.
*/
export const ArcadeCabinet = styled.div`
  --cabinet-neon: color-mix(in srgb, var(--color-fg-danger) 50%, var(--color-fg-accent));
  --cabinet-stripe-a: var(--cabinet-neon);
  --cabinet-stripe-b: var(--color-fg-accent);
  --cabinet-stripe-c: var(--color-fg-attention);

  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding-block: 0 clamp(1rem, 3vw, 1.5rem);
  padding-inline: clamp(1.25rem, 4vw, 2.25rem);
  background:
    linear-gradient(to bottom, color-mix(in srgb, var(--cabinet-neon) 10%, transparent), transparent 12rem),
    color-mix(in srgb, var(--color-bg-default) 82%, black);
  border: 0.125rem solid color-mix(in srgb, var(--cabinet-neon) 35%, var(--color-border-default));
  border-radius: 1rem 1rem 0.5rem 0.5rem;
  box-shadow:
    inset 0 0 0 0.25rem color-mix(in srgb, black 25%, transparent),
    0 0.75rem 1.5rem -0.75rem color-mix(in srgb, black 50%, transparent);
  overflow: hidden;

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset-block: 0;
    inline-size: clamp(0.5rem, 1.5vw, 0.875rem);
    background: repeating-linear-gradient(
      160deg,
      var(--cabinet-stripe-a) 0 0.75rem,
      var(--cabinet-stripe-b) 0.75rem 1.5rem,
      var(--cabinet-stripe-c) 1.5rem 2.25rem,
      transparent 2.25rem 3rem
    );
    opacity: 0.55;
    pointer-events: none;
  }

  &::before {
    inset-inline-start: 0.25rem;
  }

  &::after {
    inset-inline-end: 0.25rem;
    transform: scaleX(-1);
  }
`;

/*
  Backlit marquee across the top of the cabinet — a rail of bulbs on its top and bottom edges
  chases slowly (a background-position loop, switched off under prefers-reduced-motion), and the
  title glows in the cabinet neon like a lit sign.
*/
export const Marquee = styled.header`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-inline: calc(-1 * clamp(1.25rem, 4vw, 2.25rem));
  padding: 1.125rem clamp(1.25rem, 4vw, 2.25rem);
  background:
    radial-gradient(circle, color-mix(in srgb, var(--color-fg-attention) 85%, white) 0 0.125rem, transparent 0.1875rem) 0 0.25rem / 1rem 0.5rem repeat-x,
    radial-gradient(circle, color-mix(in srgb, var(--color-fg-attention) 85%, white) 0 0.125rem, transparent 0.1875rem) 0.5rem calc(100% - 0.25rem) / 1rem 0.5rem repeat-x,
    linear-gradient(100deg, color-mix(in srgb, var(--cabinet-neon) 30%, black), color-mix(in srgb, var(--color-fg-accent) 26%, black));
  border-block-end: 0.1875rem solid color-mix(in srgb, var(--cabinet-neon) 55%, black);
  animation: arcade-bulb-chase 2.4s steps(4) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @keyframes arcade-bulb-chase {
    to {
      background-position: 1rem 0.25rem, -0.5rem calc(100% - 0.25rem), 0 0;
    }
  }
`;

// The neon title in the marquee — two stacked text-shadows give a hot core and a wider bloom, which is what makes it read as a lit sign rather than coloured text.
export const MarqueeTitle = styled.span`
  font-family: ${MONO_FONT};
  font-size: clamp(1rem, 2.6vw, 1.375rem);
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--cabinet-neon) 35%, white);
  text-shadow:
    0 0 0.25rem color-mix(in srgb, var(--cabinet-neon) 90%, transparent),
    0 0 1rem color-mix(in srgb, var(--cabinet-neon) 70%, transparent);
`;

// The marquee's right-hand cluster of coin plates; wraps under the title on phones rather than squeezing the buttons.
export const ToolbarRow = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
`;

/*
  Coin-door plate — a bevelled metal-ish button with a glowing slot down its leading edge, the
  arcade's own idiom for "press to act". Used for every discrete toolbar action so the whole
  control set reads as one cabinet's hardware.
*/
export const CoinButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  min-block-size: 2.25rem;
  min-inline-size: 2.25rem;
  padding-block: 0;
  padding-inline: 1rem 0.625rem;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-fg-default) 85%, var(--cabinet-neon));
  background: linear-gradient(to bottom, color-mix(in srgb, var(--color-bg-muted) 80%, white), color-mix(in srgb, var(--color-bg-muted) 70%, black));
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 70%, black);
  border-radius: 0.375rem;
  box-shadow:
    inset 0 0.0625rem 0 color-mix(in srgb, white 25%, transparent),
    0 0.125rem 0 color-mix(in srgb, black 45%, transparent);
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 100ms ease, color 150ms ease;

  &::before {
    content: "";
    position: absolute;
    inset-block: 0.5rem;
    inset-inline-start: 0.4375rem;
    inline-size: 0.1875rem;
    border-radius: 0.125rem;
    background: color-mix(in srgb, var(--color-fg-attention) 75%, black);
    box-shadow: 0 0 0.375rem color-mix(in srgb, var(--color-fg-attention) 60%, transparent);
  }

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
  }

  &:hover:not(:disabled)::before,
  &[aria-pressed="true"]::before {
    background: var(--color-fg-attention);
    box-shadow: 0 0 0.625rem var(--color-fg-attention);
  }

  &:active:not(:disabled) {
    transform: translateY(0.125rem);
    box-shadow: inset 0 0.0625rem 0 color-mix(in srgb, white 15%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:disabled::before {
    background: color-mix(in srgb, var(--color-fg-muted) 50%, black);
    box-shadow: none;
  }
`;

/*
  Editor beside screen on wide viewports, stacked on narrow ones — where ScreenColumn reorders
  itself first so the canvas, the payoff, is seen without scrolling past a wall of GLSL.
*/
export const GeneratorGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    align-items: start;
  }
`;

// The source editor's column; deliberately the wider of the two so typical shader lines fit without horizontal scrolling.
export const EditorColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// The CRT and its uniform controls — pulled above the editor on narrow viewports, where scrolling past GLSL to reach the canvas would bury the point of the tool.
export const ScreenColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;

  @media (max-width: 59.99rem) {
    order: -1;
  }
`;

// Presets and sharing sit under both columns as a full-width tray — the cabinet's coin-door panel.
export const TrayRow = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 48rem) {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    align-items: start;
  }
`;

// A panel screwed onto the cabinet's control deck — inset dark plate with a faint neon edge, so every card reads as part of the same moulding.
export const SectionCard = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: color-mix(in srgb, black 18%, var(--color-bg-muted));
  border: 0.0625rem solid color-mix(in srgb, var(--cabinet-neon) 22%, var(--color-border-muted));
  border-radius: 0.5rem;
  box-shadow: inset 0 0.0625rem 0.375rem color-mix(in srgb, black 30%, transparent);
`;

// Panel heading styled like a cabinet's printed instruction card — uppercase, tracked out, with a small lit pip before it.
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
  color: color-mix(in srgb, var(--cabinet-neon) 70%, var(--color-fg-default));

  &::before {
    content: "";
    inline-size: 0.5rem;
    block-size: 0.5rem;
    border-radius: 50%;
    background: var(--color-fg-attention);
    box-shadow: 0 0 0.375rem var(--color-fg-attention);
  }
`;

// Small explanatory copy inside a card — one shared style instead of repeating inline style objects in every panel.
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
