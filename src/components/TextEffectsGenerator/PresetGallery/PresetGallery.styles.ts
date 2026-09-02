import { styled } from "@linaria/react";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

// Each preset gets its own tiny "page" so its pageColor reads correctly — same reasoning BoxShadowGenerator's own PresetStage already applies (a Neon Glow thumbnail on the panel's own muted card background would just look like a blur).
export const PresetStage = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  block-size: 3.5rem;
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

export const PresetSample = styled.span`
  font-size: 0.9375rem;
  font-weight: 800;
  line-height: 1;
`;

export const PresetLabel = styled.span`
  font-size: 0.625rem;
  color: var(--color-fg-muted);
  text-align: center;
`;
