import { css } from "@linaria/core";

// A class rather than a styled component because Radix.Item owns the rendered element.
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
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.3s cubic-bezier(0.17, 0.67, 0.51, 1),
    transform 0.3s cubic-bezier(0.17, 0.67, 0.51, 1);
  /*
    Per-item entrance stagger via sibling-index() — falls back to every item transitioning in
    together (still a working, non-staggered entrance) on browsers without sibling-index() support.
  */
  transition-delay: 0.1s, 0.1s;
  transition-delay:
    calc(0.1s + (sibling-index() - 1) * 40ms),
    calc(0.1s + (sibling-index() - 1) * 40ms);

  @starting-style {
    opacity: 0;
    transform: translateY(-4px);
  }

  &[data-highlighted] {
    background: var(--color-bg-neutral-muted);
  }

  &[data-disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
