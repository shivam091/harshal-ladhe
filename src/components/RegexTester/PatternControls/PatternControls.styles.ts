import { styled } from "@linaria/react";

export const Delimited = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.25rem;
`;

export const Slash = styled.span`
  display: flex;
  align-items: center;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-fg-muted);
`;

export const PatternInput = styled.input`
  flex: 1 1 auto;
  min-inline-size: 0;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;

  &[data-invalid="true"] {
    border-color: var(--color-border-danger-emphasis);
  }
`;

export const FlagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

export const FlagChip = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.0625rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  cursor: pointer;

  &[data-active="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
  }
`;

export const FlagLetter = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-weight: 700;
`;

export const FlagName = styled.span`
  font-size: 0.625rem;
`;

export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-danger);
`;
