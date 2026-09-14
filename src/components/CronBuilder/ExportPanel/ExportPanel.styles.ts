import { styled } from "@linaria/react";

// Segmented pill control (a single tinted track, the active segment riding on top) rather than the old underline tabs.
export const Segmented = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  padding: 0.1875rem;
  background: var(--color-bg-muted);
  border-radius: 0.5rem;
`;

export const Segment = styled.button`
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
  }

  &:not([data-selected="true"]):hover {
    color: var(--color-fg-default);
  }
`;
