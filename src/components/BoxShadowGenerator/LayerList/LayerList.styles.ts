import { styled } from "@linaria/react";

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const LayerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

// The layer's own selectable summary chip — a color swatch, its offset/blur/spread readout, and an inset badge, so the list alone tells you what's stacked without opening each layer.
export const LayerButton = styled.button`
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

export const LayerSwatch = styled.span`
  flex: 0 0 auto;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border-radius: 50%;
  border: 0.0625rem solid var(--color-border-muted);
`;

export const LayerSummary = styled.span`
  flex: 1 1 auto;
  min-inline-size: 0;
  overflow: hidden;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const InsetBadge = styled.span`
  flex: 0 0 auto;
  padding: 0.0625rem 0.3125rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-fg-on-emphasis);
  background: var(--color-fg-muted);
  border-radius: 0.1875rem;
`;

export const LayerActions = styled.div`
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

export const AddLayerButton = styled.button`
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
