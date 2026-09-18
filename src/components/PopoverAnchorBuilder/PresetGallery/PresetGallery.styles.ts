import { styled } from "@linaria/react";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

export const PresetCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  block-size: 4rem;
  padding: 0.5rem;
  overflow: hidden;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover {
    border-color: var(--color-fg-accent);
  }
`;

// The preset's own anchor-side glyph, standing in for a rendered thumbnail — this tool has no visual "shape" to sample at thumbnail scale the way TriangleGenerator does, so the compass glyph itself is the fastest way to recognize a preset's placement at a glance.
export const PresetGlyph = styled.span`
  font-size: 1.125rem;
  color: var(--color-fg-accent);
`;

export const PresetLabel = styled.span`
  font-size: 0.625rem;
  color: var(--color-fg-muted);
  text-align: center;
`;
