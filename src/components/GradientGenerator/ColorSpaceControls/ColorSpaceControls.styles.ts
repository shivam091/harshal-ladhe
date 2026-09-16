import { styled } from "@linaria/react";

// Segmented radio row for RGB/HSL/OKLCH — same tinted-track idiom as TypeControls' TypeRow, kept as its own copy since the two rows can diverge in width/spacing independently.
export const SpaceRow = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  padding: 0.1875rem;
  background: color-mix(in srgb, var(--color-bg-muted) 70%, transparent);
  border-radius: 0.5rem;
`;

// One segment inside SpaceRow.
export const SpaceButton = styled.button`
  padding: 0.375rem 0.875rem;
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

// Muted one-line explanation beneath the color-space row.
export const HelperText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
