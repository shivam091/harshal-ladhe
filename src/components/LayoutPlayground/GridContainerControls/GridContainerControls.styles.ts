import { styled } from "@linaria/react";

export const TrackRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const TrackRow = styled.div`
  display: grid;
  grid-template-columns: 3.5rem 1fr auto;
  align-items: center;
  gap: 0.375rem;
`;

export const TrackSizeInput = styled.input`
  inline-size: 100%;
  min-inline-size: 0;
  padding: 0.25rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;

  &:disabled {
    opacity: 0.5;
  }
`;

export const TrackRemoveButton = styled.button`
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

  &:hover {
    color: var(--color-fg-default);
    border-color: var(--color-fg-accent);
  }
`;

export const AddTrackButton = styled.button`
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
