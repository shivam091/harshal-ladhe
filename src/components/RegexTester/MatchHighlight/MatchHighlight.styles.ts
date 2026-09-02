import { styled } from "@linaria/react";

export const TestTextarea = styled.textarea`
  inline-size: 100%;
  min-block-size: 8rem;
  padding: 0.625rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  resize: vertical;
`;

export const HighlightPane = styled.div`
  padding: 0.625rem;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
`;

export const MatchSpan = styled.mark`
  padding: 0.0625rem 0;
  color: var(--color-fg-default);
  background: var(--color-bg-accent-muted);
  border-radius: 0.125rem;
`;

export const SummaryRow = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;

export const ErrorBanner = styled.p`
  margin: 0;
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  color: var(--color-fg-danger);
  background: var(--color-bg-danger-muted);
  border: 0.0625rem solid var(--color-border-danger-emphasis);
  border-radius: 0.375rem;
`;
