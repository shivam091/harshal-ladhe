import { styled } from "@linaria/react";

export const TextInput = styled.input`
  inline-size: 100%;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

export const HelperText = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
