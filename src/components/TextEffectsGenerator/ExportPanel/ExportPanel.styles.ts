import { styled } from "@linaria/react";

// Row of format tabs — an underline marks the active one, the same "rule, not fill" selection language as GradientFillControls' own TypeRow, rather than BoxShadowGenerator's raised segmented-pill chip.
export const TabRow = styled.div`
  display: flex;
  gap: 0.25rem;
  border-block-end: 0.0625rem solid var(--color-border-muted);
`;

// One format tab inside TabRow.
export const Tab = styled.button`
  padding: 0.5rem 0.75rem;
  margin-block-end: -0.0625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-block-end: 0.125rem solid transparent;
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease;

  &[data-selected="true"] {
    color: var(--color-fg-default);
    border-block-end-color: var(--color-fg-default);
  }

  &:not([data-selected="true"]):hover {
    color: var(--color-fg-default);
  }
`;
