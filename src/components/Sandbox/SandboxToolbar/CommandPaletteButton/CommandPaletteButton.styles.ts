import { styled } from "@linaria/react";

// Fuzzy-search input at the top of the command palette.
export const Input = styled.input`
  inline-size: 100%;
  padding: var(--space-xs) var(--space-sm);
  margin-block-end: var(--space-sm);
  border: var(--border-width-default) solid var(--color-border-muted);
  border-radius: var(--border-radius-md);
  background: var(--color-bg-default);
  color: var(--color-fg-default);
  font-family: var(--font-stack-system);
  font-size: var(--font-size-md);

  &:focus {
    outline: none;
    border-color: var(--color-border-accent-emphasis);
  }
`;

// Scrollable list of matching commands.
export const List = styled.ul`
  margin: var(--space-none);
  padding: var(--space-none);
  list-style: none;
  max-block-size: 18rem;
  overflow: auto;
`;

// One command row — the actual clickable surface is the <button> Item wraps.
export const Item = styled.li`
  & > button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    inline-size: 100%;
    padding: var(--space-xs) var(--space-sm);
    border: none;
    border-radius: var(--border-radius-md);
    background: transparent;
    color: var(--color-fg-default);
    font-family: var(--font-stack-system);
    font-size: var(--font-size-sm);
    text-align: start;
    cursor: pointer;

    &:hover,
    &:focus-visible {
      background: var(--color-bg-neutral-muted);
      outline: none;
    }
  }
`;

// The action's label — free to shrink/truncate so Shortcut always has room.
export const Label = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// Key-combo hint on the trailing edge of a command row — muted so it reads as secondary to the label.
export const Shortcut = styled.span`
  display: flex;
  align-items: center;
  gap: var(--space-xxs);
  flex-shrink: 0;
  color: var(--color-fg-muted);
`;

// Shown when the query matches nothing.
export const Empty = styled.p`
  padding: var(--space-sm);
  margin: var(--space-none);
  color: var(--color-fg-muted);
  font-size: var(--font-size-sm);
`;
