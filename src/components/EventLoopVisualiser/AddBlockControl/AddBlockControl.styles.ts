import { styled } from "@linaria/react";

// Kind picker and add button kept on one compact row so an add control at every nesting level doesn't swamp the tree.
export const AddRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

// A plain native select, for its built-in keyboard and screen-reader behaviour.
export const KindSelect = styled.select`
  min-inline-size: 0;
  padding: 0.1875rem 0.375rem;
  font-family: var(--signal-mono);
  font-size: 0.6875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

// A small black "points" lever cap — adding a block sets a new route, so it borrows the lever styling at button scale.
export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.1875rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-fg-default);
  background: var(--signal-plate);
  border: 0.0625rem solid var(--color-border-default);
  border-block-start: 0.1875rem solid var(--color-fg-default);
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    border-color: var(--color-fg-attention);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-attention);
    outline-offset: 0.0625rem;
  }
`;
