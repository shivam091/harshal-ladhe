import { styled } from "@linaria/react";

// Turntable beside the Web API lamp panel on wider screens, stacked on a phone so neither gets squeezed.
export const DiagramTop = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.875rem;
  align-items: center;

  @media (min-width: 36rem) {
    grid-template-columns: 11rem minmax(0, 1fr);
  }
`;

// Vertical stack of sidings — the shared column keeps every siding's label plate and track aligned like a real diagram.
export const Sidings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

// A block-instrument style panel of lamps, one per pending Web API — a lamp is a better fit than a car, since timers wait off the running lines entirely.
export const LampPanel = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin: 0;
  padding: 0.5rem;
  list-style: none;
  min-block-size: 2.75rem;
  background: var(--signal-plate);
  border-radius: 0.25rem;
`;

// One pending timer or fetch: an amber lamp beside its label and the virtual time it falls due.
export const ApiLamp = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-family: var(--signal-mono);
  font-size: 0.6875rem;
  color: var(--color-fg-default);
  border: 0.0625rem solid color-mix(in oklab, var(--color-fg-attention) 45%, transparent);
  border-radius: 999rem;
  animation: event-loop-lamp-in 260ms ease-out;

  &::before {
    content: "";
    inline-size: 0.5rem;
    block-size: 0.5rem;
    border-radius: 50%;
    background: var(--color-fg-attention);
    box-shadow: 0 0 0.5rem 0.0625rem color-mix(in oklab, var(--color-fg-attention) 70%, transparent);
  }

  @keyframes event-loop-lamp-in {
    from {
      opacity: 0;
      transform: scale(0.85);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// Muted "due at" figure — secondary to the API's name, but the thing that decides its order.
export const DueAt = styled.span`
  color: var(--color-fg-muted);
`;

// Italic placeholder for an empty panel, matching the empty sidings.
export const EmptyNote = styled.li`
  font-size: 0.75rem;
  font-style: italic;
  color: var(--color-fg-muted);
`;

// Smaller than PanelTitle so the Web APIs and console read as parts of the one diagram.
export const SubTitle = styled.h4`
  margin: 0 0 0.375rem;
  font-family: var(--signal-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-fg-default);
`;

/*
  The console as a station departure board — dark slats, monospace amber-on-dark lines, newest at
  the bottom. Each line flips in once; the flip is disabled under prefers-reduced-motion.
*/
export const DepartureBoard = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin: 0;
  padding: 0.5rem 0.625rem;
  min-block-size: 3rem;
  list-style: none;
  counter-reset: board;
  font-family: var(--signal-mono);
  font-size: 0.8125rem;
  background: color-mix(in oklab, black 30%, var(--signal-enamel-deep));
  border-radius: 0.25rem;
`;

// A console line — numbered via a CSS counter so the order of output is explicit, not just implied by position.
export const BoardLine = styled.li`
  counter-increment: board;
  color: var(--color-fg-attention);
  animation: event-loop-board-flip 300ms ease-out;
  transform-origin: 50% 0;

  &::before {
    content: counter(board, decimal-leading-zero) "  ";
    color: var(--color-fg-muted);
  }

  @keyframes event-loop-board-flip {
    from {
      opacity: 0;
      transform: rotateX(-80deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// Placeholder row for an empty or masked board.
export const BoardNote = styled.li`
  font-style: italic;
  color: var(--color-fg-muted);
`;
