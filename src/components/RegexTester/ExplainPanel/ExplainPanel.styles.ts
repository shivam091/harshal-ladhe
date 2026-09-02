import { styled } from "@linaria/react";

export const Tree = styled.ul`
  margin: 0;
  padding-inline-start: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const Node = styled.li`
  font-size: 0.8125rem;
  color: var(--color-fg-default);
`;

export const Token = styled.code`
  padding: 0.0625rem 0.3125rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-accent);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
`;

export const Description = styled.span`
  margin-inline-start: 0.375rem;
  color: var(--color-fg-muted);
`;

export const EmptyState = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
