import { styled } from "@linaria/react";

// Framed like the other in-post playgrounds so readers recognise it as something to interact with.
export const Wrapper = styled.div`
  margin-block: 3rem;
  padding: 1.5rem;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.75rem;
  background: var(--color-bg-muted);
`;

// Side-by-side columns so both entrances are watched in the same glance; stacks on narrow screens.
export const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1rem;
`;

// Heading above each column naming the one CSS difference between them.
export const ColumnTitle = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
`;

// Fixed min-height keeps the page from jumping as cards are added and cleared.
export const CardList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.75rem;
  min-block-size: 13rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 0.0625rem dashed var(--color-border-muted);
  border-radius: 0.5rem;
  background: var(--color-bg-default);
`;

// Shared card look, so the only visible difference between columns is how each card enters.
const cardBase = `
  padding: 0.625rem 0.75rem;
  border: 0.0625rem solid var(--color-border-accent-emphasis);
  border-radius: 0.5rem;
  background: var(--color-bg-accent-muted);
  font-size: 0.8125rem;
`;

/*
  The post's exact pattern: a transition plus an @starting-style before-state. The large offset and
  scale are deliberate so the missing transform transition is obvious when data-opacity-only drops it.
*/
export const AnimatedCard = styled.li`
  ${cardBase}
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: opacity 500ms ease-out, transform 500ms ease-out;

  @starting-style {
    opacity: 0;
    transform: translateY(1.25rem) scale(0.85);
  }

  &[data-opacity-only] {
    transition: opacity 500ms ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Same transition but no @starting-style, reproducing the single-frame pop-in the post opens with.
export const PlainCard = styled.li`
  ${cardBase}
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: opacity 500ms ease-out, transform 500ms ease-out;
`;

// Muted counter line inside each card, proving a re-render touches the node without replaying its entrance.
export const RenderCount = styled.span`
  display: block;
  color: var(--color-fg-muted);
  font-size: 0.75rem;
`;

// Controls sit under the columns they drive, wrapping on narrow screens.
export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-block-start: 1.25rem;
`;

// Native checkbox keeps keyboard and screen-reader behaviour for free.
export const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  cursor: pointer;

  & input[type="checkbox"] {
    accent-color: var(--color-fg-accent);
  }
`;

// Explains why the demo looks static for readers who asked for less motion, instead of it seeming broken.
export const Note = styled.p`
  margin: 1rem 0 0;
  color: var(--color-fg-muted);
  font-size: 0.8125rem;
  text-align: center;
`;
