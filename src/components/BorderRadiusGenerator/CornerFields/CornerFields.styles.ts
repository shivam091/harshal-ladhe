import { styled } from "@linaria/react";

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CornerRow = styled.div`
  display: grid;
  grid-template-columns: 5rem 1fr 1fr;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  border-radius: 0.25rem;

  &[data-selected="true"] {
    outline: 0.0625rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;

export const CornerLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

export const AxisField = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const AxisPrefix = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

export const AxisInput = styled.input`
  inline-size: 100%;
  min-inline-size: 0;
  padding: 0.25rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;
