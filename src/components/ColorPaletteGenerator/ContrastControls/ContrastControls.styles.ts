import { styled } from "@linaria/react";

// Swaps the foreground/background roles — styled like a small ticket stub action rather than a full-width primary button, since it's a secondary convenience next to the two hex fields above it.
export const SwapButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  align-self: flex-start;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-fg-muted);
  background: var(--color-bg-muted);
  border: 0.0625rem dashed var(--color-border-default);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease;

  &:hover {
    color: var(--color-fg-accent);
    border-color: var(--color-fg-accent);
  }
`;
