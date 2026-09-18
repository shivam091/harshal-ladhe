import { styled } from "@linaria/react";

// Two-up card grid of preset thumbnails.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

// One clickable preset card — its own little "page" so the thumbnail's colors read clearly against a neutral background.
export const PresetStage = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  block-size: 4.5rem;
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

// The thumbnail's own grid — sized to the preset's column/row COUNTS (not its literal track sizes, which a 2rem-wide thumbnail couldn't render meaningfully) so the shape of its named areas still reads correctly at a glance.
export const PresetSample = styled.div`
  display: grid;
  inline-size: 2.5rem;
  block-size: 2rem;
  gap: 0.0625rem;
`;

// One named area's own colored cell within the thumbnail grid — positioned purely by inline gridArea, same as PreviewPane's real PlaceholderItem.
export const PresetSampleCell = styled.span`
  border-radius: 0.0625rem;
`;

// Preset name printed under its thumbnail.
export const PresetLabel = styled.span`
  font-size: 0.625rem;
  color: var(--color-fg-muted);
  text-align: center;
`;
