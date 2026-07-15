import { css } from "@linaria/core";

// Selectable menu row — className applied to Radix.Item in the component.
export const itemClass = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  inline-size: 100%;
  padding-block: 0.5rem;
  padding-inline: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  cursor: pointer;
  outline: none;
  user-select: none;
  border-radius: 0.25rem;

  &[data-highlighted] {
    background: var(--color-bg-neutral-muted);
  }

  &[data-disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
