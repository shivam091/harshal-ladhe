import { styled } from "@linaria/react";

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const ItemButton = styled.button`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 0.5rem;
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

export const ItemSwatch = styled.span`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.5rem;
  block-size: 1.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-fg-on-emphasis);
  border-radius: 0.25rem;
`;

export const ItemLabel = styled.span`
  flex: 1 1 auto;
  overflow: hidden;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ItemActions = styled.div`
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
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

export const AddItemButton = styled.button`
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

export const EmptyState = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
