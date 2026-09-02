import { styled } from "@linaria/react";

export const List = styled.ol`
  margin: 0;
  padding-inline-start: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const RunItem = styled.li`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
`;

export const RelativeLabel = styled.span`
  margin-inline-start: 0.5rem;
  font-family: inherit;
  color: var(--color-fg-muted);
`;

export const EmptyState = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
