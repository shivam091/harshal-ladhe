import { styled } from "@linaria/react";

export const InlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const InlineLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

export const NumberInput = styled.input`
  inline-size: 4rem;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

export const TextInput = styled.input`
  inline-size: 100%;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;
