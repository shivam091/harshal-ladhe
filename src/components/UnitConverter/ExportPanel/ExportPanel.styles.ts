import { styled } from "@linaria/react";

// Wraps and scrolls rather than overflowing — five tabs don't fit a phone's width in one row.
export const TabRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-block-end: 0.0625rem solid var(--color-border-muted);
`;

// Underlined in tape-yellow when selected, tying the active format back to the shell's tape.
export const Tab = styled.button`
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-block-end: 0.125rem solid transparent;
  margin-block-end: -0.0625rem;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-default);
    border-block-end-color: var(--color-fg-attention);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: -0.125rem;
  }
`;
