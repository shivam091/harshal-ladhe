import { styled } from "@linaria/react";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

// Each preset gets its own tiny "page" so its pageColor reads correctly rather than sitting on the panel's own muted card background — same reasoning as BoxShadowGenerator's own PresetStage.
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

export const PresetStage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border-radius: 0.25rem;
  overflow: hidden;
`;

// 2rem (32px) — must match PresetGallery.tsx's THUMBNAIL_SIZE exactly: clip-path's path() coordinates are absolute px in the element's own box, not scaled to fit it, so a squircle preset's thumbnail path is pre-scaled to this same size rather than relying on CSS to fit it.
export const PresetSwatch = styled.div`
  inline-size: 2rem;
  block-size: 2rem;
`;

export const PresetLabel = styled.span`
  font-size: 0.625rem;
  color: var(--color-fg-muted);
  text-align: center;
`;
