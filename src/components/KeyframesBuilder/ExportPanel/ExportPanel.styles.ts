import { styled } from "@linaria/react";

// Tab strip ruled off from the code below it, like the column headings across an exposure sheet.
export const TabRow = styled.div`
  display: flex;
  gap: 0.25rem;
  border-block-end: 0.0625rem solid var(--sheet-rule);
`;

// One export-format tab; the active one is underlined in pencil yellow rather than the site accent, to stay inside the sheet's palette.
export const Tab = styled.button`
  padding: 0.5rem 0.75rem;
  margin-block-end: -0.0625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-block-end: 0.1875rem solid transparent;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-default);
    border-block-end-color: var(--sheet-pencil);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--sheet-pencil);
    outline-offset: -0.125rem;
  }
`;
