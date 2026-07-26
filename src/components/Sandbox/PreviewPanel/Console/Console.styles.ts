import { styled } from "@linaria/react";

// Shown when nothing has been logged yet.
export const Empty = styled.p`
  padding: var(--space-base);
  margin: var(--space-none);
  color: var(--color-fg-success);
  font-family: var(--font-stack-monospace);
  font-size: var(--font-size-sm);
`;

// Scrollable list of console entries.
export const List = styled.ul`
  block-size: 100%;
  margin: var(--space-none);
  padding: var(--space-sm);
  list-style: none;
  overflow: auto;
  font-family: var(--font-stack-monospace);
  font-size: var(--font-size-sm);
`;
