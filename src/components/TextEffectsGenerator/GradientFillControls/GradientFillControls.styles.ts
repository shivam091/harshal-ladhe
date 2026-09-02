import { styled } from "@linaria/react";

export const TypeRow = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const TypeButton = styled.button`
  flex: 1;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
  }
`;

export const StopList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StopColorInput = styled.input`
  flex: 0 0 auto;
  appearance: none;
  inline-size: 2rem;
  block-size: 1.75rem;
  padding: 0;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  background: transparent;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0.125rem;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 0.125rem;
  }
`;

export const StopPositionInput = styled.input`
  inline-size: 3.25rem;
  padding: 0.25rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

export const StopRemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-inline-start: auto;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const AddStopButton = styled.button`
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
