import { styled } from "@linaria/react";

/*
  "Annotation Desk" shell — a warm, paper-toned look unique to this tool: a soft amber wash bleeding
  in from the top-right corner (like lamplight catching a page) behind an otherwise ordinary card,
  a dashed rule reminiscent of a cutting guide, and one clipped corner suggesting a dog-eared index
  card — the tactile opposite of CronBuilder's cold, glassy Console.
*/
export const Desk = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background:
    radial-gradient(ellipse 28rem 16rem at 92% -14%, color-mix(in srgb, var(--color-fg-attention) 15%, transparent), transparent 62%),
    var(--color-bg-muted);
  border: 0.0625rem dashed color-mix(in srgb, var(--color-fg-attention) 38%, var(--color-border-muted));
  border-radius: 0.75rem;
  clip-path: polygon(0 0, calc(100% - 1.25rem) 0, 100% 1.25rem, 100% 100%, 0 100%);

  /* The dog-eared fold shadow sitting in the clipped top-right corner. */
  &::after {
    content: "";
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    inline-size: 1.25rem;
    block-size: 1.25rem;
    background: linear-gradient(135deg, transparent 50%, color-mix(in srgb, var(--color-fg-attention) 26%, transparent) 50%);
    pointer-events: none;
  }
`;

// Top row of the desk — the tool's title, so readers know which tool they're in at a glance.
export const DeskHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

// Small-caps label identifying this tool, paired with InkPulse and the regex icon.
export const DeskTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
`;

// Small pulsing dot standing in for "matching live as you type" — the desk's one bit of ambient motion, in amber ink rather than Console's status-display green.
export const InkPulse = styled.span`
  position: relative;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: var(--color-fg-attention);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: inherit;
    animation: regex-ink-pulse 2s ease-out infinite;
  }

  @keyframes regex-ink-pulse {
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

// Two-column layout below the pattern hero — a single column on narrow viewports, main content plus a sticky side panel from 64rem up.
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

// The wider column — the highlighter, capture-group notes, explanation tree, and export code.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-inline-size: 0;

  /*
    Below the two-column breakpoint the column dissolves into the outer grid, so Presets can sit
    between the panels a reader works through first and Export, the last thing they reach for.
  */
  @media (width < 64rem) {
    display: contents;

    & > :last-child {
      order: 1;
    }
  }
`;

// The narrower column for presets — sticky on desktop so they stay in reach while scrolling the main column.
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
  Base card every panel below builds on — the "Annotation Desk" counterpart to CronBuilder's own
  Panel: a faint ruled-paper texture (repeating hairlines at very low opacity) behind the content
  instead of a flat neutral card, so every panel reads as a page on the desk rather than a console tile.
*/
export const Panel = styled.section`
  position: relative;
  background:
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 1.5rem,
      color-mix(in srgb, var(--color-fg-attention) 5%, transparent) 1.5rem,
      color-mix(in srgb, var(--color-fg-attention) 5%, transparent) calc(1.5rem + 0.0625rem)
    ),
    var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.625rem;
  overflow: hidden;
`;

// A panel's title bar — a faint warm tint and a dashed rule (rather than a solid one) separating it from the body below.
export const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: color-mix(in srgb, var(--color-fg-attention) 7%, transparent);
  border-block-end: 0.0625rem dashed color-mix(in srgb, var(--color-fg-attention) 32%, var(--color-border-muted));
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
