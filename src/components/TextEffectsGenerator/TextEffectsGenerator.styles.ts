import { styled } from "@linaria/react";

/*
  "Editorial Stage" shell — a magazine production-sheet look, distinct from CronBuilder's dark-glass
  Console, RegexTester's warm-paper Annotation Desk, GradientGenerator's glassmorphic Live Canvas,
  and BoxShadowGenerator's tabletop-depth Elevation Stack. Nothing here simulates a physical material
  the way those do — it reads as a printed page instead: a flat surface, a heavy top rule (the kind
  that runs above a newspaper's nameplate), and crisp hairlines doing all the separating work no
  card shadow does here.
*/
export const Broadsheet = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-block-start: 0.25rem solid var(--color-fg-default);
  border-radius: 0.25rem;
`;

// Top row of the sheet — the tool's masthead label on the left, the proofing tray (undo/redo/reset) on the right.
export const MastheadRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-block-end: 0.75rem;
`;

/*
  The double hairline under the masthead — a classic nameplate rule (a thin line, a gap, another
  thin line) rendered with a single element via a repeating background rather than two separate
  DOM nodes, so it stays a purely decorative, non-content divider.
*/
export const MastheadRule = styled.div`
  position: absolute;
  inset-block-end: 0;
  inset-inline: 0;
  block-size: 0.1875rem;
  background: linear-gradient(to bottom, var(--color-border-default) 0.0625rem, transparent 0.0625rem, transparent 0.125rem, var(--color-border-muted) 0.125rem, var(--color-border-muted) 0.1875rem);
`;

// Small-caps masthead label identifying this tool, set in a serif face for one deliberate typographic contrast against the sans-serif controls below — the one place this theme reads as "printed" rather than "on-screen".
export const MastheadTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: Georgia, "Times New Roman", Times, serif;
  font-style: italic;
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--color-fg-default);
`;

/*
  Small pulsing dot standing in for "this preview is live" — a red editorial ink dot (evoking a
  proofreader's correction mark) rather than Console's status-green, Desk's amber ink, or Elevation
  Stack's ambient glow.
*/
export const PressDot = styled.span`
  position: relative;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: var(--color-fg-danger);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: inherit;
    animation: text-effects-press-pulse 2s ease-out infinite;
  }

  @keyframes text-effects-press-pulse {
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

// Tray holding the undo/redo/reset buttons — a plain ruled box, like a small correction key printed in a margin.
export const ProofTray = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
`;

// One icon button inside ProofTray — undo, redo, or reset.
export const ProofButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: none;
  border-radius: 0.1875rem;
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
    background: var(--color-bg-default);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

// Two-column layout below the masthead — a single column on narrow viewports, the stage/manuscript in the main column plus a sticky spec-sheet side rail from 62rem up.
export const Layout = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;

  @media (min-width: 62rem) {
    grid-template-columns: minmax(0, 1fr) 21rem;
    align-items: start;
  }
`;

// The wider column — the spotlight stage, the shadow-layer manuscript, and the export code.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;
`;

// The narrower column — text/gradient/layer fields, presets, and the share permalink; sticky on desktop so it stays in view while scrolling the main column.
export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;

  @media (min-width: 62rem) {
    position: sticky;
    inset-block-start: 1rem;
  }
`;

/*
  Base card every panel below builds on — the "Editorial Stage" counterpart to Console/Desk/Canvas/
  Tabletop's own Panel: a flat card with a single hairline border and no cast shadow at all, so
  separation between panels reads as ruled-off sections of one production sheet rather than tiles
  floating above a surface.
*/
export const Panel = styled.section`
  position: relative;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  overflow: hidden;
`;

// A panel's title bar — a plain muted strip under a crisp rule, like a running head printed above a column of body text.
export const PanelHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: var(--color-bg-muted);
  border-block-end: 0.0625rem solid var(--color-border-default);
`;

// A panel's small-caps heading text, plus room for a leading icon — wider letterspacing than the other three tools' own PanelTitle, reading closer to a magazine section label ("FEATURES", "LETTERS") than a UI group heading.
export const PanelTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
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
