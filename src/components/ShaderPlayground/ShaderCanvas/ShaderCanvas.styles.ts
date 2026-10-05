import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/ShaderPlayground/ShaderPlayground.styles";

/*
  The CRT's moulded bezel — a thick, rounded plastic surround with a bevel highlight on its top
  edge. Also the fullscreen target, so going fullscreen keeps the cabinet framing rather than
  dumping a bare canvas onto the screen.
*/
export const Bezel = styled.div`
  position: relative;
  padding: clamp(0.625rem, 2vw, 1rem);
  background: linear-gradient(to bottom, color-mix(in srgb, var(--color-bg-muted) 55%, black), color-mix(in srgb, var(--color-bg-muted) 30%, black));
  border-radius: 1.25rem;
  box-shadow:
    inset 0 0.125rem 0 color-mix(in srgb, white 14%, transparent),
    inset 0 -0.25rem 0.5rem color-mix(in srgb, black 40%, transparent),
    0 0 0 0.1875rem color-mix(in srgb, var(--cabinet-neon) 35%, black);

  &:fullscreen {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    border-radius: 0;
    background: black;
  }
`;

/*
  The tube itself: black glass with a heavy corner radius standing in for screen curvature, a
  vignette, static scanlines and a soft diagonal reflection. Scanlines here are fixed — unlike
  the Oscilloscope shell's drifting ones — because the shader underneath is already doing all the
  moving, and a second animation on top would fight it.
*/
export const Screen = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  inline-size: 100%;
  overflow: hidden;
  background: black;
  border-radius: 1.5rem / 1.25rem;
  box-shadow: 0 0 1.5rem color-mix(in srgb, var(--cabinet-neon) 25%, transparent);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      repeating-linear-gradient(to bottom, color-mix(in srgb, black 28%, transparent) 0 0.0625rem, transparent 0.0625rem 0.1875rem),
      radial-gradient(ellipse at center, transparent 55%, color-mix(in srgb, black 65%, transparent) 100%);
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(135deg, color-mix(in srgb, white 10%, transparent) 0%, transparent 35%);
    border-radius: inherit;
    pointer-events: none;
  }

  :fullscreen > & {
    inline-size: min(100%, calc((100dvh - 4rem) * 1.6));
  }
`;

// The WebGL surface fills the tube; its drawing-buffer size is set separately each frame from the resolution scale, so CSS size and pixel count stay independent.
export const Canvas = styled.canvas`
  display: block;
  inline-size: 100%;
  block-size: 100%;
  touch-action: none;
  cursor: crosshair;
`;

// Messages painted on the tube itself (paused, context lost, no WebGL) — arcade attract-mode lettering rather than a separate alert box.
export const ScreenMessage = styled.p`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 1rem;
  font-family: ${MONO_FONT};
  font-size: clamp(0.75rem, 2vw, 0.9375rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-align: center;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-fg-attention) 60%, white);
  text-shadow: 0 0 0.5rem var(--color-fg-attention);
  background: color-mix(in srgb, black 55%, transparent);
  pointer-events: none;
`;

// A small corner badge rather than a full overlay for "paused", so a paused frame stays fully visible for inspection or a screenshot.
export const ScreenBadge = styled.span`
  position: absolute;
  inset-block-start: 0.75rem;
  inset-inline-end: 1rem;
  z-index: 2;
  padding: 0.125rem 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: color-mix(in srgb, var(--color-fg-attention) 60%, white);
  text-shadow: 0 0 0.375rem var(--color-fg-attention);
  background: color-mix(in srgb, black 55%, transparent);
  border-radius: 0.25rem;
  pointer-events: none;
`;

// The sloped control panel under the screen — a top highlight and darker lower edge suggest the angled deck of a real cabinet.
export const ControlDeck = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  padding: 0.875rem 1rem;
  background: linear-gradient(to bottom, color-mix(in srgb, var(--cabinet-neon) 18%, var(--color-bg-muted)), color-mix(in srgb, var(--color-bg-muted) 75%, black));
  border: 0.0625rem solid color-mix(in srgb, var(--cabinet-neon) 30%, var(--color-border-default));
  border-radius: 0.5rem 0.5rem 0.875rem 0.875rem;
  box-shadow: inset 0 0.125rem 0 color-mix(in srgb, white 12%, transparent);
`;

// A cluster of related deck controls kept together when the deck wraps on a phone.
export const DeckGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`;

// The time-scale slider's slot on the deck — given room to grow so the range isn't a stub between button clusters.
export const DeckSlider = styled.div`
  flex: 1 1 10rem;
  min-inline-size: 9rem;
`;

/*
  The big round arcade push-button for play/pause — the one control everyone reaches for first,
  so it gets the cabinet's most recognisable hardware: a domed cap in the cabinet neon sunk into a
  dark collar, which visibly depresses when pressed.
*/
export const ArcadeButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 3rem;
  block-size: 3rem;
  padding: 0;
  color: color-mix(in srgb, var(--cabinet-neon) 15%, white);
  background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--cabinet-neon) 55%, white), var(--cabinet-neon) 45%, color-mix(in srgb, var(--cabinet-neon) 60%, black));
  border: 0.25rem solid color-mix(in srgb, var(--color-bg-muted) 40%, black);
  border-radius: 50%;
  box-shadow:
    0 0.25rem 0 color-mix(in srgb, var(--cabinet-neon) 40%, black),
    0 0.375rem 0.5rem color-mix(in srgb, black 40%, transparent);
  cursor: pointer;
  transition: transform 80ms ease, box-shadow 80ms ease;

  &:active {
    transform: translateY(0.1875rem);
    box-shadow: 0 0.0625rem 0 color-mix(in srgb, var(--cabinet-neon) 40%, black);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.25rem;
  }
`;

// Two bars drawn in CSS — the icon set has a play glyph but no pause, and a dedicated pause icon would mean touching the shared icon registry.
export const PauseGlyph = styled.span`
  display: block;
  inline-size: 0.875rem;
  block-size: 1rem;
  border-inline: 0.3125rem solid currentColor;
`;

// Segmented resolution picker — each option is a small toggle, lit when active, like a cabinet's DIP-switch bank.
export const ScaleOption = styled.button`
  min-inline-size: 2.75rem;
  padding: 0.25rem 0.375rem;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-fg-muted);
  background: color-mix(in srgb, black 25%, var(--color-bg-default));
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  cursor: pointer;

  &[aria-pressed="true"] {
    color: color-mix(in srgb, var(--color-fg-attention) 70%, white);
    border-color: var(--color-fg-attention);
    box-shadow: 0 0 0.5rem color-mix(in srgb, var(--color-fg-attention) 45%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;

// Small caption beside a deck group, the stencilled label under real cabinet controls.
export const DeckLabel = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
`;

// Segmented LED-style FPS counter — a fixed-width readout so the deck doesn't reflow as the number changes.
export const FpsReadout = styled.output`
  display: inline-flex;
  align-items: baseline;
  gap: 0.375rem;
  min-inline-size: 6.5rem;
  padding: 0.25rem 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: color-mix(in srgb, var(--color-fg-danger) 60%, white);
  text-shadow: 0 0 0.375rem var(--color-fg-danger);
  background: black;
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-danger) 30%, black);
  border-radius: 0.25rem;
`;
