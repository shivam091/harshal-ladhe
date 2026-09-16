import { styled } from "@linaria/react";

/*
  "Live Canvas" shell — a soft, fixed two-tone wash rather than a flat single-tone card, so the
  glass panels floating on top of it (see Panel below) still read as translucent against something
  with a little depth of its own. The gradient actually being edited no longer paints this outer
  shell directly (see PreviewPane instead, a dedicated rectangle between the toolbar and the rest of
  the controls) — a full-bleed live backdrop made small UI text hard to guarantee legible against an
  arbitrary user-picked gradient, so the preview is now its own bounded surface instead.
*/
export const Canvas = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  border-radius: 1.25rem;
  border: 0.0625rem solid var(--color-border-muted);
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-bg-muted), var(--color-bg-default));
`;

// Everything a visitor actually reads or interacts with.
export const CanvasBody = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: clamp(1rem, 3vw, 1.75rem);
`;

// Top row — tool title on the left, undo/redo/reset toolbar on the right.
export const CanvasHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

// Small-caps label identifying this tool, paired with GlowPulse and the gradient icon, riding on its own glass chip (like Toolbar) so it reads clearly against any gradient rather than sitting bare over the backdrop.
export const CanvasTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-fg-default);
  background: color-mix(in srgb, var(--color-bg-default) 55%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 60%, transparent);
  border-radius: 624.9375rem;
`;

// Small pulsing dot standing in for "rendering live as you edit" — this tool's own ambient-motion accent, in the site's accent color rather than Console's status green or Desk's amber.
export const GlowPulse = styled.span`
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
    animation: gradient-glow-pulse 2s ease-out infinite;
  }

  @keyframes gradient-glow-pulse {
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

// Pill-shaped glass tray holding the undo/redo/reset buttons.
export const Toolbar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  background: color-mix(in srgb, var(--color-bg-default) 55%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 60%, transparent);
  border-radius: 0.625rem;
`;

// One icon button inside Toolbar — undo, redo, or reset.
export const ToolbarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: none;
  border-radius: 0.4375rem;
  background: transparent;
  color: var(--color-fg-default);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-accent);
    background: color-mix(in srgb, var(--color-fg-accent) 16%, transparent);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// Two-column layout below the header — a single column on narrow viewports, main controls plus a sticky side panel from 64rem up. Same breakpoint CronBuilder/RegexTester both use, for a consistent reading width across every goodie.
export const Layout = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;

  @media (min-width: 64rem) {
    grid-template-columns: minmax(0, 1fr) 21rem;
    align-items: start;
  }
`;

// The wider column — type/geometry/stop/color-space controls plus the export code.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;
`;

// The narrower column — presets and the share permalink; sticky on desktop so it stays in view while scrolling the main column.
export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;

  @media (min-width: 64rem) {
    position: sticky;
    inset-block-start: 1rem;
  }
`;

/*
  Base card every panel below builds on — the "Live Canvas" counterpart to Console/Desk's own Panel:
  a translucent, blurred glass surface rather than a flat opaque card, so the live gradient backdrop
  keeps showing faintly through every panel instead of being fully hidden behind it.
*/
export const Panel = styled.section`
  position: relative;
  background: color-mix(in srgb, var(--color-bg-default) 72%, transparent);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 55%, transparent);
  border-radius: 0.875rem;
  box-shadow: var(--box-shadow-sm);
  overflow: hidden;
`;

// A panel's title bar — a hairline glass rule separating it from the body below.
export const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-block-end: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 45%, transparent);
`;

// A panel's small-caps heading text.
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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
`;
