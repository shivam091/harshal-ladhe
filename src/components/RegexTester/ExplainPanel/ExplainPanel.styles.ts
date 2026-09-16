import { styled } from "@linaria/react";

// One level of the explain breakdown — a group's own list, and each nested list one level deeper.
export const Tree = styled.ul`
  margin: 0;
  padding-inline-start: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

// One explain-tree entry — a token chip (if any) followed by its plain-English description.
export const Node = styled.li`
  font-size: 0.8125rem;
  color: var(--color-fg-default);
`;

// A pattern fragment rendered like a small paper clipping pinned to its explanation — dashed edge and a warm tint rather than a plain code chip.
export const Token = styled.code`
  padding: 0.0625rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-attention);
  background: color-mix(in srgb, var(--color-fg-attention) 12%, var(--color-bg-default));
  border: 0.0625rem dashed color-mix(in srgb, var(--color-fg-attention) 45%, transparent);
  border-radius: 0.25rem;
`;

// The plain-English sentence fragment describing a node's token.
export const Description = styled.span`
  margin-inline-start: 0.375rem;
  color: var(--color-fg-muted);
`;

// Shown when the pattern parses to no nodes at all (an empty pattern).
export const EmptyState = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
