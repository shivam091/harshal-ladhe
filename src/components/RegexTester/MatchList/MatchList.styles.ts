import { styled } from "@linaria/react";

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-block-size: 20rem;
  overflow-y: auto;
`;

export const MatchCard = styled.div`
  padding: 0.5rem 0.625rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
`;

export const MatchHeader = styled.p`
  margin: 0 0 0.25rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
`;

export const MatchIndex = styled.span`
  color: var(--color-fg-muted);
`;

export const GroupList = styled.ul`
  margin: 0;
  padding-inline-start: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const GroupItem = styled.li`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

export const EmptyState = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
