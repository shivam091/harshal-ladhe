import { styled } from "@linaria/react";

// Shared monospace stack for every drafting-style callout/label in this tool — matches the shared DemoControlField range/track labels so numeric readouts look consistent site-wide.
const DRAFTING_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

/*
  "Blueprint Grid" shell — a drafting table's own work surface: a fine graph-paper hairline grid
  (color-mixed off the theme's own border-muted token, never a raw hex, so it stays correct in
  light/dark/soft-dark) plus an inset frame line, the way a real technical drawing sheet is printed
  a little inside its own paper edge. Distinct from every other goodie's own backdrop: no glass
  (Live Canvas), no equipment chassis (Optics Bench), no soft clay studio glow (Clay Studio), no
  warm paper grain (Annotation Desk), no dark spotlight stage (Editorial Stage), no stacked-card
  tabletop (Elevation Stack). The one deliberately fixed, non-token color in this whole theme lives
  one level down, in PreviewPane's own DraftingSheet — see that styled-component's own comment.
*/
export const Board = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1.125rem, 3vw, 1.875rem);
  background-color: var(--color-bg-neutral-muted);
  background-image: repeating-linear-gradient(
      to right,
      color-mix(in srgb, var(--color-border-muted) 55%, transparent) 0,
      color-mix(in srgb, var(--color-border-muted) 55%, transparent) 0.0625rem,
      transparent 0.0625rem,
      transparent 1.5rem
    ),
    repeating-linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-border-muted) 55%, transparent) 0,
      color-mix(in srgb, var(--color-border-muted) 55%, transparent) 0.0625rem,
      transparent 0.0625rem,
      transparent 1.5rem
    );
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  box-shadow: var(--box-shadow-sm);
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0.5rem;
    border: 0.0625rem solid color-mix(in srgb, var(--color-fg-muted) 30%, transparent);
    pointer-events: none;
  }
`;

// Top row of the board — the drawing's own title block on the left, the undo/redo/reset rail on the right.
export const BoardHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

/*
  The drawing's own "title block" — the small bordered nameplate every real technical drawing
  carries in a corner, stating what the sheet is. Rendered here as a compact bordered tag rather
  than a full multi-row title-block table, since this is a live tool header, not a printed sheet.
*/
export const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.625rem;
  font-family: ${DRAFTING_FONT};
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

/*
  Small "drawing is live" indicator standing in for a revision stamp — pulses gently like a
  drafting light box, distinct from every other goodie's own status dot (Clay Studio's soft dab,
  Optics Bench's rack LED, Live Canvas's own indicator).
*/
export const RevisionMark = styled.span`
  position: relative;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: var(--color-fg-accent);

  &::after {
    content: "";
    position: absolute;
    inset: -0.1875rem;
    border-radius: 50%;
    border: 0.0625rem solid color-mix(in srgb, var(--color-fg-accent) 55%, transparent);
    animation: layout-playground-revision-pulse 2.2s ease-out infinite;
  }

  @keyframes layout-playground-revision-pulse {
    0% {
      opacity: 0.8;
      transform: scale(0.8);
    }
    100% {
      opacity: 0;
      transform: scale(2);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`;

// Tray holding undo/redo/reset — a small drafting-tool holder along the top edge of the board.
export const ToolRail = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3125rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
`;

// One tool sitting in the rail — undo, redo, or reset — square with slightly clipped corners, like a drafting instrument's own housing rather than a soft pill.
export const ToolRailButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: 0.0625rem solid transparent;
  border-radius: 0.25rem;
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-accent);
    background: color-mix(in srgb, var(--color-fg-accent) 12%, transparent);
    border-color: color-mix(in srgb, var(--color-fg-accent) 35%, transparent);
  }

  &:active:not(:disabled) {
    transform: scale(0.94);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: color 150ms ease, background 150ms ease, border-color 150ms ease;

    &:active:not(:disabled) {
      transform: none;
    }
  }
`;

// Two-column layout below the header — a single column on narrow viewports, the drawing/export in the main column plus a sticky control-rail side panel from 64rem up.
export const Layout = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;

  @media (min-width: 64rem) {
    grid-template-columns: minmax(0, 1fr) 21rem;
    align-items: start;
  }
`;

// The wider column — the drafted drawing preview and the export sheet.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;
`;

// The narrower column — mode/container controls, the parts list, the selected item's own fields, the preset shelf, and the share permalink; sticky on desktop so it stays in view while scrolling the main column.
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
  Base card every panel below builds on — the "Blueprint Grid" counterpart to every other goodie's
  own Panel: crisp square corners and a thin rule under the header, reading as a bordered section of
  a drawing sheet rather than a soft studio slab (Clay Studio), bolted equipment (Optics Bench), or
  floating glass (Live Canvas).
*/
export const Panel = styled.section`
  position: relative;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  box-shadow: var(--box-shadow-sm);
  overflow: hidden;
`;

// A panel's title strip — an uppercase monospace drafting callout, like a section label stamped along a drawing's own border.
export const PanelHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: color-mix(in srgb, var(--color-bg-muted) 92%, var(--color-fg-default) 2%);
  border-block-end: 0.0625rem dashed var(--color-border-muted);
`;

// A panel's heading text, plus room for a leading icon — uppercase monospace with wide tracking, reading as an engineering-drawing section label rather than a soft rounded wordmark.
export const PanelTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  font-family: ${DRAFTING_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
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
