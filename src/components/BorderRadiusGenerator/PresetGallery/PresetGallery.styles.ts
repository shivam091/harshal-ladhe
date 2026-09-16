import { styled } from "@linaria/react";

// Grid of preset shelf pieces.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

// One preset rendered as a small finished piece sitting on its own little shelf tile — distinct from FamilyControls' clay-lump swatches (those are raw material samples; these are complete, glazed-looking pieces) and RadiusOverlay's pinch-point handles.
export const ShelfTile = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.4375rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 1rem;
  cursor: pointer;
  transition: border-color 150ms ease, transform 150ms ease;

  &:hover {
    border-color: var(--color-fg-accent);
    transform: translateY(-0.0625rem);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: border-color 150ms ease;

    &:hover {
      transform: none;
    }
  }
`;

// Each preset's own miniature worktable, so its pageColor reads correctly rather than sitting on the panel's own card background.
export const ShelfStage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border-radius: 0.625rem;
  overflow: hidden;
`;

// 2rem (32px) — must match PresetGallery.tsx's THUMBNAIL_SIZE exactly: clip-path's path() coordinates are absolute px in the element's own box, not scaled to fit it, so a squircle preset's thumbnail path is pre-scaled to this same size rather than relying on CSS to fit it.
export const ShelfPiece = styled.div`
  inline-size: 2rem;
  block-size: 2rem;
`;

// The preset's name, printed under its own shelf tile.
export const ShelfLabel = styled.span`
  font-size: 0.625rem;
  color: var(--color-fg-muted);
  text-align: center;
`;
