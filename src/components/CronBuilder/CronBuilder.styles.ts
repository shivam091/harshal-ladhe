import { styled } from "@linaria/react";

/*
  "Console" shell — a dark-glass control-panel look unique to this tool: a soft radial glow bleeding
  in from the top-left corner (evoking a status display) behind an otherwise ordinary card, rather
  than the flat single-tone GeneratorWrapper every other goodie shares.
*/
export const Console = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(1rem, 3vw, 1.75rem);
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 1rem;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset-block-start: -6rem;
    inset-inline-start: -6rem;
    inline-size: 18rem;
    block-size: 18rem;
    background: radial-gradient(circle, color-mix(in srgb, var(--color-fg-accent) 16%, transparent), transparent 70%);
    pointer-events: none;
  }
`;

export const Deck = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export const DeckTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
`;

// Small pulsing dot standing in for "this schedule is live/ticking" — the console's one bit of ambient motion.
export const LivePulse = styled.span`
  position: relative;
  inline-size: 0.5rem;
  block-size: 0.5rem;
  border-radius: 50%;
  background: var(--color-fg-success);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: inherit;
    animation: cron-pulse 2s ease-out infinite;
  }

  @keyframes cron-pulse {
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

// The wider column — the schedule a reader edits, the runs it produces, and the export it ends in.
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
  Base card every panel below builds on — deliberately plainer than the old shared SectionCard
  (no default padding/gap) so each panel can shape its own header/body rhythm instead of all five
  panels reading as identical boxes stacked in a column.
*/
export const Panel = styled.section`
  position: relative;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.75rem;
  overflow: hidden;
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-block-end: 0.0625rem solid var(--color-border-muted);
`;

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

export const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
`;
