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

// The preset's own reference-gradient swatch, rendered with the exact filter/backdrop-filter it would produce — a thumbnail that IS the output, not a separate hand-drawn icon standing in for it.
export const PresetStage = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border-radius: 0.25rem;
  overflow: hidden;
  background-image: linear-gradient(135deg, #f97316 0%, #ec4899 33%, #8b5cf6 66%, #06b6d4 100%);
  background-size: cover;
`;

export const PresetGlassPanel = styled.div`
  inline-size: 65%;
  block-size: 55%;
  border-radius: 0.25rem;
`;

export const PresetLabel = styled.span`
  font-size: 0.625rem;
  color: var(--color-fg-muted);
  text-align: center;
`;
