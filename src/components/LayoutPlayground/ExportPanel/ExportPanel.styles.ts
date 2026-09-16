import { styled } from "@linaria/react";

// Row of format tabs, styled like a drawing's own sheet-number tabs along its edge.
export const TabRow = styled.div`
  display: flex;
  gap: 0.25rem;
`;

// One format tab — the active one reads as the sheet currently pulled to the front, underlined in the accent color rather than filled, keeping the row feeling like flat paper tabs rather than pill buttons.
export const Tab = styled.button`
  padding: 0.25rem 0.625rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-block-end: 0.125rem solid transparent;
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease;

  &:hover {
    color: var(--color-fg-default);
  }

  &[data-selected="true"] {
    color: var(--color-fg-accent);
    border-block-end-color: var(--color-fg-accent);
  }
`;
