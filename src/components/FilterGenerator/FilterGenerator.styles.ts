import { styled } from "@linaria/react";

/*
  "Optics Bench" shell — the whole tool sits on a matte equipment chassis rather than glass
  (GradientGenerator's Live Canvas), a paper surface (RegexTester's Annotation Desk), a tabletop
  (BoxShadowGenerator's Elevation Stack), or a printed sheet (TextEffectsGenerator's Editorial
  Stage). A faint diagonal brushed-metal hatch (a repeating-linear-gradient tinted off the theme's
  own foreground token, never a raw hex) reads as machined surface texture at any zoom, and four
  corner "screws" — radial-gradient dots baked into the same pseudo-element — pin the chassis down
  like a rack-mounted unit rather than a floating card.
*/
export const Bench = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background: var(--color-bg-neutral-muted);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.625rem;
  box-shadow: var(--box-shadow-sm);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-fg-default) 4%, transparent) 0,
        color-mix(in srgb, var(--color-fg-default) 4%, transparent) 0.0625rem,
        transparent 0.0625rem,
        transparent 0.5rem
      ),
      radial-gradient(circle, color-mix(in srgb, var(--color-fg-default) 30%, transparent) 40%, transparent 42%),
      radial-gradient(circle, color-mix(in srgb, var(--color-fg-default) 30%, transparent) 40%, transparent 42%),
      radial-gradient(circle, color-mix(in srgb, var(--color-fg-default) 30%, transparent) 40%, transparent 42%),
      radial-gradient(circle, color-mix(in srgb, var(--color-fg-default) 30%, transparent) 40%, transparent 42%);
    background-size:
      auto,
      0.5rem 0.5rem,
      0.5rem 0.5rem,
      0.5rem 0.5rem,
      0.5rem 0.5rem;
    background-position:
      0 0,
      0.625rem 0.625rem,
      calc(100% - 0.625rem) 0.625rem,
      0.625rem calc(100% - 0.625rem),
      calc(100% - 0.625rem) calc(100% - 0.625rem);
    background-repeat: repeat, no-repeat, no-repeat, no-repeat, no-repeat;
    pointer-events: none;
  }
`;

// Top row of the bench — the tool's nameplate on the left, the control deck (undo/redo/reset) on the right. Sits above the corner-screw pseudo-element via z-index so its own hit targets stay clickable.
export const BenchHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

// Small-caps nameplate label identifying this tool, stamped in a monospace face like equipment engraving.
export const BenchTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
`;

/*
  Small rack-mount status LED standing in for "this preview is live" — an amber-through-accent glow
  pulsing like powered-on studio gear, distinct from Console's status-green, Desk's ink-amber,
  Elevation Stack's ambient ceiling glow, and Editorial Stage's proofreader's-red dot.
*/
export const StatusLED = styled.span`
  position: relative;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: var(--color-fg-accent);
  box-shadow: 0 0 0 0.125rem color-mix(in srgb, var(--color-fg-default) 12%, transparent);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: inherit;
    animation: filter-generator-led-pulse 2s ease-out infinite;
  }

  @keyframes filter-generator-led-pulse {
    0% {
      opacity: 0.6;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(2.75);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`;

// Tray holding the undo/redo/reset buttons — recessed like a small control deck bolted onto the bench, an inset groove rather than ToolTray's raised caddy or ProofTray's plain ruled box.
export const ControlDeck = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  box-shadow: inset 0 0.0625rem 0.1875rem color-mix(in srgb, var(--color-fg-default) 14%, transparent);
`;

// One icon button inside ControlDeck — undo, redo, or reset, styled like a small satin-finish equipment key.
export const ControlDeckButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, transform 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-accent);
    background: color-mix(in srgb, var(--color-fg-accent) 14%, transparent);
  }

  &:active:not(:disabled) {
    transform: translateY(0.0625rem);
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

// Two-column layout below the header — a single column on narrow viewports, the viewfinder/lens rack/export in the main column plus a sticky control-panel side rail from 60rem up.
export const Layout = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;

  @media (min-width: 60rem) {
    grid-template-columns: minmax(0, 1fr) 21rem;
    align-items: start;
  }
`;

// The wider column — the viewfinder preview, the lens rack, and the export code.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;
`;

// The narrower column — target switch, panel/subject controls, presets, and the share permalink; sticky on desktop so it stays in view while scrolling the main column.
export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;

  @media (min-width: 60rem) {
    position: sticky;
    inset-block-start: 1rem;
  }
`;

/*
  Base card every panel below builds on — the "Optics Bench" counterpart to every other goodie's own
  Panel: a flat equipment module plate with a crisp border and its own small cast shadow, as if
  screwed onto the bench surface rather than resting loosely (Elevation Stack) or floating in glass
  (Live Canvas).
*/
export const Panel = styled.section`
  position: relative;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.5rem;
  box-shadow: var(--box-shadow-sm);
  overflow: hidden;
`;

// A panel's title bar — a muted strip with a bottom hairline, like a small engraved nameplate riveted to the top of the module.
export const PanelHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-bg-muted);
  border-block-end: 0.0625rem solid var(--color-border-muted);
`;

// A panel's small-caps heading text, plus room for a leading icon, set in the same engraved monospace as BenchTitle.
export const PanelTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-fg-muted);
`;

// A panel's padded content area beneath its header.
export const PanelBody = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
`;
