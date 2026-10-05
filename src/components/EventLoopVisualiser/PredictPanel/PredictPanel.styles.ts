import { styled } from "@linaria/react";

// Header row: the title and the mode toggle share a line so switching the mode doesn't shift the panel's content.
export const PredictHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// Wraps a native checkbox — the platform control already handles keyboard and screen readers, so it's only restyled.
export const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  cursor: pointer;

  input {
    accent-color: var(--color-fg-attention);
  }
`;

// The pool of lines still to place, laid out as luggage tickets waiting on the platform.
export const Pool = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

// Dashed until hovered, like a ticket not yet stamped.
export const PoolChip = styled.button`
  padding: 0.25rem 0.5rem;
  font-family: var(--signal-mono);
  font-size: 0.75rem;
  color: var(--color-fg-default);
  background: var(--signal-plate);
  border: 0.0625rem dashed color-mix(in oklab, var(--color-fg-attention) 55%, transparent);
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    border-style: solid;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-attention);
    outline-offset: 0.0625rem;
  }
`;

// The guessed order — after reveal each line is marked right or wrong in place, beside the line that actually printed there.
export const GuessList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding-inline-start: 1.5rem;
  font-family: var(--signal-mono);
  font-size: 0.75rem;
  color: var(--color-fg-default);

  li[data-result="right"] {
    color: var(--color-fg-success);
  }

  li[data-result="wrong"] {
    color: var(--color-fg-danger);
  }
`;

// The real line, shown only beside a wrong guess so the correction sits right where the mistake is.
export const Actual = styled.span`
  color: var(--color-fg-muted);
`;

// Undo/clear/reveal on one wrapping row.
export const ButtonRow = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

// Secondary buttons, with data-primary marking Reveal as the one to press.
export const SmallButton = styled.button`
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-default);
  background: var(--signal-plate);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  cursor: pointer;

  &[data-primary="true"] {
    border-color: var(--color-fg-attention);
    background: color-mix(in oklab, var(--color-fg-attention) 18%, var(--signal-plate));
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-attention);
    outline-offset: 0.0625rem;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// The result line, announced via role="status" when it appears.
export const Score = styled.p`
  margin: 0;
  font-family: var(--signal-mono);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;
