import { styled } from "@linaria/react";

export const CronLine = styled.code`
  display: block;
  padding: 0.625rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-fg-accent);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
`;

export const Sentence = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-fg-default);
`;
