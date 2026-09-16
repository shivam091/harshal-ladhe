import { styled } from "@linaria/react";

// Two-column grid of preset tiles.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

// One preset as a small raised tile — lifts and deepens its shadow on hover, the same "pick this up" invitation as a LayerRow card, so choosing a preset feels like lifting a sample off the table rather than clicking a swatch in a list.
export const PresetButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  box-shadow: var(--box-shadow-sm);
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;

  &:hover {
    transform: translateY(-0.125rem);
    border-color: var(--color-fg-accent);
    box-shadow: var(--box-shadow-md);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 150ms ease, border-color 150ms ease;

    &:hover {
      transform: none;
    }
  }
`;

// Each preset gets its own little "room" (its own page color) so a dark preset (Neon Glow) or a colored one (Long Shadow, Sharp Retro) doesn't sit on the panel's own card background and read wrong.
export const PresetStage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  block-size: 2.75rem;
  border-radius: 0.375rem;
  overflow: hidden;
`;

// The preset's own swatch, rendered on its own page color with its own compiled shadow — a thumbnail that IS the output, not a separate hand-drawn icon standing in for it.
export const PresetSwatch = styled.div`
  inline-size: 1.375rem;
  block-size: 1.375rem;
`;

// The preset's human-readable name beneath its thumbnail.
export const PresetLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  text-align: center;
`;
