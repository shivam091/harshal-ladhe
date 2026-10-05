import { styled } from "@linaria/react";

// A single column at every width — each preset needs the full panel width for its one-line summary.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.375rem;
`;

// A preset as a route-indicator plate: the name in caps, the rule it demonstrates underneath.
export const PresetButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
  padding: 0.5rem 0.625rem;
  text-align: start;
  background: var(--signal-plate);
  border: 0.0625rem solid var(--color-border-muted);
  border-inline-start: 0.25rem solid var(--color-fg-accent);
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    border-color: var(--color-fg-attention);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-attention);
    outline-offset: 0.0625rem;
  }
`;

// Monospace name, echoing the code the preset loads.
export const PresetName = styled.span`
  font-family: var(--signal-mono);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;

// The one rule the preset demonstrates.
export const PresetSummary = styled.span`
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
