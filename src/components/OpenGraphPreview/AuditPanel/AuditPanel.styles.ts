import { styled } from "@linaria/react";

// A running tally above the list, so the overall state reads at a glance before anyone scans each row.
export const Summary = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
`;

// Each tally count in its own status colour.
export const SummaryCount = styled.span`
  &[data-status="pass"] {
    color: var(--color-fg-success);
  }

  &[data-status="warn"] {
    color: var(--color-fg-attention);
  }

  &[data-status="fail"] {
    color: var(--color-fg-danger);
  }
`;

// Checks as lines on the index card — one per rule, in a fixed order so nothing jumps while typing.
export const CheckList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// Badge column, then label and message.
export const CheckItem = styled.li`
  display: grid;
  grid-template-columns: 3.25rem minmax(0, 1fr);
  gap: 0.5rem;
  align-items: start;
  font-size: 0.8125rem;
  line-height: 1.45;
`;

/*
  The verdict as a small rubber-stamp badge — the text (PASS/WARN/FAIL) carries the meaning, so
  colour is reinforcement rather than the only signal.
*/
export const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.0625rem 0.25rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-align: center;
  text-transform: uppercase;
  border: 0.09375rem solid currentColor;
  border-radius: 0.1875rem;
  rotate: -3deg;

  &[data-status="pass"] {
    color: var(--color-fg-success);
  }

  &[data-status="warn"] {
    color: var(--color-fg-attention);
  }

  &[data-status="fail"] {
    color: var(--color-fg-danger);
  }
`;

// The rule's name in bold ahead of its message.
export const CheckLabel = styled.strong`
  margin-inline-end: 0.375rem;
  color: var(--color-fg-default);
`;

// The explanatory sentence, muted relative to the label.
export const CheckMessage = styled.span`
  color: var(--color-fg-muted);
`;
