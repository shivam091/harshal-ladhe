import { styled } from "@linaria/react";

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const StepRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const StepButton = styled.button`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
  min-inline-size: 0;
  padding: 0.375rem 0.5rem;
  text-align: start;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: pointer;

  &[data-selected="true"] {
    border-color: var(--color-fg-accent);
    box-shadow: 0 0 0 0.0625rem var(--color-fg-accent);
  }
`;

export const StepName = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
`;

export const StepSummary = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

export const StepActions = styled.div`
  display: flex;
  flex: 0 0 auto;
  gap: 0.125rem;
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
    border-color: var(--color-fg-accent);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const AddStepButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem dashed var(--color-border-default);
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    color: var(--color-fg-default);
    border-color: var(--color-fg-accent);
  }
`;
