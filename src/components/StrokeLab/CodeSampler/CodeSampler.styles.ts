import { styled } from "@linaria/react";

// Format tabs as a strip of selvedge, each tab a woven edge label.
export const TabStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-block-end: 0.125rem dashed var(--haber-thread-soft);
`;

// One format tab; the chosen one sits on the stitched line in thread colour.
export const SampleTab = styled.button`
  margin-block-end: -0.125rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0;
  border-block-end: 0.125rem solid transparent;
  cursor: pointer;

  &[aria-selected="true"] {
    color: var(--haber-thread);
    border-block-end-color: var(--haber-thread);
  }

  &:hover:not([aria-selected="true"]) {
    color: var(--color-fg-default);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;
