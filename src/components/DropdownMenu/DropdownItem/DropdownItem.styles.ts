import { css } from "@linaria/core";

// Selectable menu row — className applied to Radix.Item in the component.
export const itemClass = css`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  inline-size: 100%;
  padding-block: var(--space-sm);
  padding-inline: var(--space-md);
  font-size: var(--font-size-sm);
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
