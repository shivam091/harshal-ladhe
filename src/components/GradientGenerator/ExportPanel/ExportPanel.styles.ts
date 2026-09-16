import { styled } from "@linaria/react";

// Segmented pill control for switching export format — same idiom as TypeControls' TypeRow, kept local since it sits in a panel header rather than a body.
export const Segmented = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  padding: 0.1875rem;
  background: color-mix(in srgb, var(--color-bg-muted) 70%, transparent);
  border-radius: 0.5rem;
`;

// One tab inside Segmented.
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
