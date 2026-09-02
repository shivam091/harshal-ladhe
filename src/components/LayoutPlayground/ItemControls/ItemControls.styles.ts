import { styled } from "@linaria/react";

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const NumberInput = styled.input`
  inline-size: 100%;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;
