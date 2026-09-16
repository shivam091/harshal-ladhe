import { styled } from "@linaria/react";

// Format switcher styled like a small row of firing-schedule dials rather than a plain tab bar — a rounded dish matching FamilyControls' own uniform-corners row.
export const KilnRow = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  padding: 0.1875rem;
  background: var(--color-bg-muted);
  border-radius: 999px;
`;

// One export format's own dial — raised with a small cast shadow while active, flat otherwise.
export const KilnDial = styled.button`
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, box-shadow 150ms ease;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    box-shadow: var(--box-shadow-sm);
  }

  &:not([data-selected="true"]):hover {
    color: var(--color-fg-default);
  }
`;
