import { styled } from "@linaria/react";

// Segmented pill control (a single tinted track, the active segment riding on top) — same idiom as CronBuilder's own Segmented, tinted with this tool's warm ink colour instead of the site accent. Scrolls sideways on phones, where four language tabs beside the title outgrow the header.
export const Segmented = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  min-inline-size: 0;
  padding: 0.1875rem;
  overflow-x: auto;
  scrollbar-width: none;
  background: var(--color-bg-muted);
  border-radius: 0.5rem;
`;

// One language tab inside Segmented.
export const Segment = styled.button`
  flex-shrink: 0;
  padding: 0.375rem 0.75rem;
  white-space: nowrap;
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
    background: var(--color-fg-attention);
  }

  &:not([data-selected="true"]):hover {
    color: var(--color-fg-default);
  }
`;
