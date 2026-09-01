import { styled } from "@linaria/react";

export const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
  cursor: pointer;
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

// Shared chrome for every small text-button in this panel (Shuffle/Sync topology) — a plain bordered button rather than the icon-only ToolbarButton, since these need a text label to explain a non-obvious action.
export const SmallButton = styled.button`
  padding: 0.375rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Calls out that Shape B doesn't yet interpolate cleanly against Shape A — sits right above the "Sync topology" fix.
export const IncompatibleNotice = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-attention);
`;
