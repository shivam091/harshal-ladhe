import { styled } from "@linaria/react";

// Fuzzy-search input at the top of the command palette.
export const Input = styled.input`
  inline-size: 100%;
  padding: 0.25rem 0.5rem;
  margin-block-end: 0.5rem;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  background: var(--color-bg-default);
  color: var(--color-fg-default);
  font-family: 'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-size: 1.125rem;

  &:focus {
    outline: none;
    border-color: var(--color-border-accent-emphasis);
  }
`;

// Scrollable list of matching commands.
export const List = styled.ul`
  margin: 0;
  padding: 0;
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
    gap: 0.5rem;
    inline-size: 100%;
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 0.375rem;
    background: transparent;
    color: var(--color-fg-default);
    font-family: 'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 0.875rem;
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
  gap: 0.1875rem;
  flex-shrink: 0;
  color: var(--color-fg-muted);
`;

// Shown when the query matches nothing.
export const Empty = styled.p`
  padding: 0.5rem;
  margin: 0;
  color: var(--color-fg-muted);
  font-size: 0.875rem;
`;
