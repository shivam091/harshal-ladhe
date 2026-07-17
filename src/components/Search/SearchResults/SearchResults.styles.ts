import { styled } from "@linaria/react";

/*
  Scroll container for the results list. Padding + negative margin combo lets the
  scrollbar sit recessed into the modal rather than flush against its edge.

  `gap` (not each row's own margin) is what spaces the result rows apart — flex items don't
  margin-collapse the way block siblings do, so a per-row margin would double up between two
  rows (each contributing its own, uncancelled). `gap` only ever applies once, between items,
  which is also what SearchResult's own divider math assumes when centering itself in it —
  the two must stay equal.
*/
export const Wrapper = styled.div`
  --stretch-by: 1.5rem;
  --row-gap: 1.5rem;

  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--row-gap);
  padding-block: 0.25rem;
  padding-inline: var(--stretch-by);
  margin-inline: calc(var(--stretch-by) * -1);
  overflow: auto;
`;

// Centered prose shown for the initial prompt and the "no results" state.
export const Message = styled.p`
  font-size: 1rem;
  font-style: italic;
  text-align: center;
  /* Fallback for browsers without balanced text wrapping. */
  max-inline-size: 33.5rem;
  margin-inline: auto;
  color: var(--color-fg-muted);
  animation: fade-in 500ms both;
  animation-delay: 450ms;

  strong {
    color: var(--color-fg-default);
    font-style: normal;
  }

  @supports (text-wrap: balance) {
    text-wrap: balance;
    max-inline-size: revert;
    margin-inline: revert;
  }
`;
