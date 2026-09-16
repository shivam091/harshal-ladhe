import { styled } from "@linaria/react";

// Segmented radio row for Linear/Radial/Conic — a single tinted track with the active segment riding on top, glass-tinted rather than CronBuilder ExportPanel's opaque Segmented.
export const TypeRow = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  padding: 0.1875rem;
  background: color-mix(in srgb, var(--color-bg-muted) 70%, transparent);
  border-radius: 0.5rem;
`;

// One segment inside TypeRow.
export const TypeButton = styled.button`
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

// Row pairing the repeating-gradient checkbox with its label.
export const RepeatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Label text beside the repeating checkbox.
export const RepeatingLabel = styled.label`
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  cursor: pointer;
`;

// Native checkbox toggling the repeating-gradient function variant.
export const RepeatingToggle = styled.input`
  inline-size: 1rem;
  block-size: 1rem;
  accent-color: var(--color-fg-accent);
  cursor: pointer;
`;
