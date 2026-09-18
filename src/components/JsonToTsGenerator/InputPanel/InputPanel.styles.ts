import { styled } from "@linaria/react";

export const SegmentRow = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const SegmentButton = styled.button`
  flex: 1 1 auto;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
  }
`;

export const NameInput = styled.input`
  inline-size: 100%;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

export const SourceTextarea = styled.textarea`
  inline-size: 100%;
  min-block-size: 16rem;
  padding: 0.625rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  resize: vertical;

  &[data-invalid="true"] {
    border-color: var(--color-border-danger-emphasis);
  }
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-danger);
`;
