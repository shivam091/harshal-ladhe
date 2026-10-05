import { styled } from "@linaria/react";

// Scrolls sideways rather than wrapping on a phone — seven platform names won't fit one row, and wrapped tabs read as two separate groups.
export const TabRow = styled.div`
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  scrollbar-width: thin;
  border-block-end: 0.0625rem solid var(--color-border-muted);
`;

// Tabs as file-folder tabs on the card — the selected one picks up the accent underline.
export const Tab = styled.button`
  flex: 0 0 auto;
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-block-end: 0.125rem solid transparent;
  margin-block-end: -0.0625rem;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-accent);
    border-block-end-color: var(--color-fg-accent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: -0.125rem;
  }
`;
