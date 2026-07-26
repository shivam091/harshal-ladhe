import { styled } from "@linaria/react";

// Shown when nothing has been logged yet.
export const Empty = styled.p`
  padding: 1rem;
  margin: 0;
  color: var(--color-fg-success);
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
`;

// Scrollable list of console entries.
export const List = styled.ul`
  flex: 1;
  min-block-size: 0;
  margin: 0;
  padding: 1rem;
  list-style: none;
  overflow: auto;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
`;
