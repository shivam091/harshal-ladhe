import { styled } from "@linaria/react";

/*
  Padding plus a negative margin let the scrollbar sit recessed into the modal. Rows are spaced
  with gap because flex items don't margin-collapse; each row's divider centres itself in this
  gap, so the two must stay equal.
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

// Centred prose shown for the initial prompt and the "no results" state.
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
