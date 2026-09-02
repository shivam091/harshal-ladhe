import { styled } from "@linaria/react";

export const GraphWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const ReadoutRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;

  &[data-selected="true"] {
    color: var(--color-fg-accent);
    border-color: var(--color-fg-accent);
  }
`;

export const ReadoutList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;
