import { styled } from "@linaria/react";

/*
  "Elevation Stack" shell — a neutral, slightly recessed "tabletop" the whole tool sits on, distinct
  from CronBuilder's dark-glass Console and RegexTester's warm-paper Annotation Desk. The recession
  is a soft inward shadow along the top edge rather than a border or gradient wash, so from the very
  first pixel the tool reads as "things rest on top of this surface" — the physical idea every panel
  and flourish below builds on.
*/
export const Tabletop = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background: var(--color-bg-neutral-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 1rem;
  box-shadow: inset 0 0.1875rem 0.75rem color-mix(in srgb, var(--color-fg-default) 7%, transparent);
`;

// Top row of the tabletop — the tool's title on the left, the undo/redo/reset tray on the right.
export const TabletopHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

// Small-caps label identifying this tool, paired with AmbientPulse and the box-shadow icon.
export const TabletopTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
`;

// Small pulsing dot standing in for "this preview is live/rendering" — an ambient glow rather than CronBuilder's status-green or RegexTester's ink-amber, evoking the soft ceiling light every cast shadow in the tool is implicitly lit by.
export const AmbientPulse = styled.span`
  position: relative;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: var(--color-fg-accent);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: inherit;
    animation: box-shadow-ambient-pulse 2s ease-out infinite;
  }

  @keyframes box-shadow-ambient-pulse {
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

// Tray holding the undo/redo/reset buttons — raised slightly off the tabletop with its own small cast shadow, like a little tool caddy sitting on the surface.
export const ToolTray = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.625rem;
  box-shadow: var(--box-shadow-sm);
`;

// One icon button inside ToolTray — undo, redo, or reset.
export const ToolTrayButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: none;
  border-radius: 0.4375rem;
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

// Two-column layout below the header — a single column on narrow viewports, main content plus a sticky side rail from 60rem up.
export const Layout = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;

  @media (min-width: 60rem) {
    grid-template-columns: minmax(0, 1fr) 21rem;
    align-items: start;
  }
`;

// The wider column — the preview stage, the layer stack, and the export code.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;
`;

// The narrower column — the selected layer's fields, surface settings, presets, and the share permalink; sticky on desktop so it stays in view while scrolling the main column.
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
  Base card every panel below builds on — the "Elevation Stack" counterpart to CronBuilder's Console
  Panel and RegexTester's Desk Panel: a real cast shadow (not just a hairline border) so each card
  visually reads as a tile resting a small height above the tabletop, matching the physical language
  the whole tool is built around.
*/
export const Panel = styled.section`
  position: relative;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.75rem;
  box-shadow: var(--box-shadow-sm);
  overflow: hidden;
`;

// A panel's title bar — a muted tint distinguishing it from the body below, like a small nameplate set into the top of the card.
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

// A panel's small-caps heading text, plus room for a leading icon.
export const PanelTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4375rem;
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
