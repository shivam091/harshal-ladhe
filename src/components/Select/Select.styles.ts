import { styled } from "@linaria/react";
import { focusRingCss } from "@/components/common.styles";

// Anchors the listbox to the trigger without a portal, so it scrolls with the page naturally.
export const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  /* A flex row would otherwise squeeze the trigger and truncate even short labels. */
  flex-shrink: 0;

  &[data-fullwidth] {
    display: block;
    inline-size: 100%;
  }
`;

// Mirrors ButtonRoot's filled look and data-size scale so a select and a button read as one design language side by side.
export const SelectTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  inline-size: 100%;
  border: 1px solid var(--color-border-control);
  background-color: var(--color-bg-control);
  color: var(--color-fg-control);
  border-radius: var(--select-radius);
  padding-inline: var(--select-padding-inline) calc(var(--select-padding-inline) * 0.75);
  --select-radius: 0.5rem;
  font-family: inherit;
  font-weight: 500;
  line-height: 1;
  text-align: start;
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease,
    filter 150ms ease,
    box-shadow 150ms ease;

  /*
    Re-declared because the class-level outline: none above out-specifies the global
    focus-visible ring, which would otherwise silently suppress keyboard focus.
  */
  &:focus-visible {
    ${focusRingCss}
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  &:hover:not(:disabled),
  &[aria-expanded="true"] {
    filter: brightness(1.1);
  }

  &[aria-expanded="true"] {
    border-color: var(--color-fg-accent);
  }

  // Sizes only swap custom properties, so the base rules never need per-size overrides.
  &[data-size="sm"] {
    block-size: 2rem;
    --select-padding-inline: 0.5rem;
    --select-radius: 0.375rem;
    font-size: 0.75rem;
  }

  &[data-size="md"] {
    block-size: 2.5rem;
    --select-padding-inline: 0.75rem;
    font-size: 0.875rem;
  }

  &[data-size="lg"] {
    block-size: 3rem;
    --select-padding-inline: 1rem;
    --select-radius: 0.625rem;
    font-size: 1rem;
  }
`;

// Truncates rather than wraps, so a long label never changes the trigger's height.
export const TriggerLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;

  &[data-placeholder] {
    color: var(--color-fg-muted);
  }
`;

// Muted so the chevron hints at the list without competing with the selected label.
export const Chevron = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: var(--color-fg-muted);
`;

// Themed in place of the browser's own popup, which can't be styled to match the site.
export const Listbox = styled.ul`
  position: absolute;
  inset-inline-start: 0;
  z-index: 1002;
  min-inline-size: 100%;
  inline-size: max-content;
  max-inline-size: min(20rem, calc(100vw - 2rem));
  max-block-size: 16rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  background: var(--color-bg-overlay);
  border: 1px solid var(--color-border-default);
  border-radius: 0.5rem;
  box-shadow: var(--box-shadow-md);
  font-size: 0.875rem;

  &[data-side="bottom"] {
    inset-block-start: calc(100% + 0.375rem);
    animation: select-in-bottom 0.3s cubic-bezier(0.17, 0.67, 0.51, 1) both;
  }

  &[data-side="top"] {
    inset-block-end: calc(100% + 0.375rem);
    animation: select-in-top 0.3s cubic-bezier(0.17, 0.67, 0.51, 1) both;
  }

  &[data-size="sm"] {
    font-size: 0.75rem;
  }

  &[data-size="lg"] {
    font-size: 1rem;
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-side] {
      animation: none;
    }
  }

  // Starts offset towards the trigger so the list appears to unfold from it.
  @keyframes select-in-bottom {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.98);
    }
  }

  @keyframes select-in-top {
    from {
      opacity: 0;
      transform: translateY(6px) scale(0.98);
    }
  }
`;

// Highlight follows both pointer and arrow keys, so there's only ever one "current" row.
export const Option = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-block: 0.5rem;
  padding-inline: 0.5rem 0.75rem;
  border-radius: 0.3125rem;
  color: var(--color-fg-default);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: background-color 100ms ease;

  &[data-highlighted] {
    background: var(--color-bg-neutral-muted);
  }

  &[aria-selected="true"] {
    color: var(--color-fg-accent);
    font-weight: 600;
  }

  &[aria-disabled="true"] {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// Fixed-width slot so labels stay aligned whether or not their row is ticked.
export const OptionCheck = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  inline-size: 0.875rem;
`;
