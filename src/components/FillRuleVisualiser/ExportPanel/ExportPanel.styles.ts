import { styled } from "@linaria/react";

// The format tabs, sitting on a came rail like panes in a horizontal strip.
export const TabRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-block-end: 0.1875rem solid var(--came);
`;

// One format tab; the selected one is lit amber from behind.
export const Tab = styled.button`
  margin-block-end: -0.1875rem;
  padding: 0.4375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0.1875rem solid transparent;
  border-block-end-color: var(--came);
  border-radius: 0.375rem 0.375rem 0 0;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-default);
    background: color-mix(in oklab, var(--color-bg-default) 70%, var(--glass-amber));
    border-color: var(--came);
    border-block-end-color: transparent;
  }

  &:focus-visible {
    outline: 0.1875rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;
