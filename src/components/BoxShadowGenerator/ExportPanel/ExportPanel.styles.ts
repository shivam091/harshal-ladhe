import { styled } from "@linaria/react";

// Segmented pill control sunk slightly into the panel header, like a groove the format tabs sit in — the active tab then reads as a small raised chip rather than a flat color swap.
export const Segmented = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  padding: 0.1875rem;
  background: var(--color-bg-default);
  border-radius: 0.5rem;
  box-shadow: inset 0 0.0625rem 0.1875rem color-mix(in srgb, var(--color-fg-default) 12%, transparent);
`;

// One format tab inside Segmented — raised with a small cast shadow while active, flat otherwise.
export const Segment = styled.button`
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, box-shadow 150ms ease;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-fg-accent);
    box-shadow: var(--box-shadow-sm);
  }

  &:not([data-selected="true"]):hover {
    color: var(--color-fg-default);
  }
`;
