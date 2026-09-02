import { styled } from "@linaria/react";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

export const PresetButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.25rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    border-color: var(--color-fg-accent);
  }
`;

// A tiny live render of the preset's own container+items — a thumbnail that IS the output at a reduced scale, not a separate hand-drawn icon standing in for it.
export const PresetStage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  padding: 0.1875rem;
  overflow: hidden;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
`;

export const PresetSwatchItem = styled.div`
  border-radius: 0.125rem;
`;

export const PresetLabel = styled.span`
  font-size: 0.625rem;
  color: var(--color-fg-muted);
  text-align: center;
`;
