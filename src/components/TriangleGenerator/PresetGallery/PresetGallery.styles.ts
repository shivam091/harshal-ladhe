import { styled } from "@linaria/react";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

// Each preset gets its own tiny "page" so its pageColor reads correctly — same reasoning BoxShadowGenerator's own PresetStage already applies.
export const PresetStage = styled.button`
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

export const PresetSample = styled.span`
  display: block;
  inline-size: 1.5rem;
  block-size: 1.5rem;
`;

export const PresetLabel = styled.span`
  font-size: 0.625rem;
  color: var(--color-fg-muted);
  text-align: center;
`;
