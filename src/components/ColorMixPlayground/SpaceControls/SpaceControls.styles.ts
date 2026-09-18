import { styled } from "@linaria/react";

// Wraps rather than a single edge-to-edge row (unlike GradientGenerator's 3-button SpaceRow) — 7 buttons need room to breathe to stay legible inside a 20rem sidebar.
export const SpaceRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

export const SpaceButton = styled.button`
  flex: 0 1 auto;
  padding: 0.375rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
  }
`;

export const HelperText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
