import { styled } from "@linaria/react";

/*
  "Clay Studio" shell — a warm, soft modeling-studio work surface rather than a matte equipment
  chassis (FilterGenerator's Optics Bench), glass (GradientGenerator's Live Canvas), paper
  (RegexTester's Annotation Desk), a tabletop (BoxShadowGenerator's Elevation Stack), or a printed
  sheet (TextEffectsGenerator's Editorial Stage). Its own corners lean deliberately soft — a large
  border-radius on the very chrome that teaches border-radius — and a faint radial glow stands in
  for diffused studio lighting rather than a hard spotlight or console glow. Never a raw hex/hsl:
  every tone here is color-mixed off the theme's own bg/fg tokens so the studio still reads
  correctly in light, dark, and soft-dark.
*/
export const Studio = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1.125rem, 3vw, 1.875rem);
  background: color-mix(in srgb, var(--color-bg-neutral-muted) 88%, var(--color-fg-default) 2%);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 1.75rem;
  box-shadow: var(--box-shadow-sm);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: -20% -10% auto -10%;
    block-size: 60%;
    background: radial-gradient(ellipse at 30% 0%, color-mix(in srgb, var(--color-fg-on-emphasis) 20%, transparent) 0%, transparent 65%);
    pointer-events: none;
  }
`;

// Top row of the studio — the tool's own nameplate on the left, the tray of undo/redo/reset tools on the right.
export const StudioHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

// The studio's nameplate label — a soft rounded wordmark rather than Optics Bench's stamped-monospace engraving.
export const StudioTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--color-fg-default);
`;

/*
  A small soft "dab" of clay standing in for "this lump is live," pulsing gently like it's still
  being worked — distinct from Optics Bench's rack-mount LED, Live Canvas's own indicator, and
  Elevation Stack's ambient glow: rounder, warmer, and slower, matching this theme's unhurried,
  tactile pace.
*/
export const StatusDab = styled.span`
  position: relative;
  inline-size: 0.5625rem;
  block-size: 0.5625rem;
  border-radius: 50%;
  background: var(--color-fg-accent);

  &::after {
    content: "";
    position: absolute;
    inset: -0.1875rem;
    border-radius: 50%;
    border: 0.0625rem solid color-mix(in srgb, var(--color-fg-accent) 55%, transparent);
    animation: border-radius-generator-dab-pulse 2.6s ease-out infinite;
  }

  @keyframes border-radius-generator-dab-pulse {
    0% {
      opacity: 0.7;
      transform: scale(0.8);
    }
    100% {
      opacity: 0;
      transform: scale(1.9);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`;

// Tray holding undo/redo/reset — a shallow dish pressed into the studio surface rather than a hard equipment control deck.
export const ToolTray = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3125rem;
  background: var(--color-bg-default);
  border-radius: 999px;
  box-shadow: inset 0 0.0625rem 0.25rem color-mix(in srgb, var(--color-fg-default) 14%, transparent);
`;

// One tool sitting in the tray — undo, redo, or reset — rounded to a full circle, like a small clay-modeling tool nested in its dish.
export const ToolTrayButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.125rem;
  block-size: 2.125rem;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, transform 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-accent);
    background: color-mix(in srgb, var(--color-fg-accent) 14%, transparent);
  }

  &:active:not(:disabled) {
    transform: scale(0.92);
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

// Two-column layout below the header — a single column on narrow viewports, the modeling stand/export in the main column plus a sticky control-shelf side rail from 60rem up.
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

// The wider column — the modeling stand preview and the export sheet.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;
`;

// The narrower column — shape lumps, corner fields, clay/worktable color, the preset shelf, and the share permalink; sticky on desktop so it stays in view while scrolling the main column.
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
  Base card every panel below builds on — the "Clay Studio" counterpart to every other goodie's own
  Panel: a soft, generously rounded slab that looks pressed rather than cut, with a gentle cast
  shadow as if resting loosely on the studio surface rather than bolted down (Optics Bench) or
  floating in glass (Live Canvas).
*/
export const Panel = styled.section`
  position: relative;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 1.25rem;
  box-shadow: var(--box-shadow-sm);
  overflow: hidden;
`;

// A panel's title strip — a muted band with a soft bottom edge, like a shallow tray molded into the top of the slab.
export const PanelHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.875rem 1.125rem;
  background: color-mix(in srgb, var(--color-bg-muted) 92%, var(--color-fg-default) 2%);
  border-block-end: 0.0625rem solid var(--color-border-muted);
`;

// A panel's heading text, plus room for a leading icon — a soft rounded label rather than the engraved small-caps used elsewhere.
export const PanelTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.015em;
  color: var(--color-fg-muted);
`;

// A panel's padded content area beneath its header.
export const PanelBody = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1.125rem;
`;
