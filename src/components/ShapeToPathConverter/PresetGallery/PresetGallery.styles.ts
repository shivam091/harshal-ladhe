import { styled } from "@linaria/react";
import { HAND_FONT } from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";

// As many worked examples per row as fit; three across in the side panel.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
  gap: 0.5rem;
`;

// Each example as a little square of exercise-book paper with its answer drawn on it.
export const PresetButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.25rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid color-mix(in srgb, var(--book-pencil) 45%, transparent);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: border-color 150ms ease, transform 150ms ease;

  &:hover {
    border-color: var(--book-ink);
    transform: rotate(-1.5deg);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--book-ink);
    outline-offset: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

// The thumbnail: the preset's own generated path on a scrap of squared paper, so it shows the output, not an icon.
export const PresetSwatch = styled.svg`
  inline-size: 2.75rem;
  block-size: 2.75rem;
  background-color: var(--book-paper);
  background-image:
    linear-gradient(to right, var(--book-grid) 0.0625rem, transparent 0.0625rem),
    linear-gradient(to bottom, var(--book-grid) 0.0625rem, transparent 0.0625rem);
  background-size: 0.55rem 0.55rem;
`;

// The example's name, in handwriting.
export const PresetLabel = styled.span`
  font-family: ${HAND_FONT};
  font-size: 0.75rem;
  line-height: 1.2;
  color: var(--color-fg-default);
  text-align: center;
`;
