import { styled } from "@linaria/react";
import { SERIF_FONT } from "@/components/IconSpriteBuilder/IconSpriteBuilder.styles";

// Two columns fit the side leaf without truncating each set's note.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
`;

// A set as a glassine stock card — a translucent pocket with a ruled top edge, lifting slightly on hover.
export const PresetCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
  padding: 0.5rem 0.625rem;
  text-align: start;
  background: color-mix(in srgb, var(--album-stamp-paper) 70%, transparent);
  border: 0.0625rem solid var(--color-border-muted);
  border-block-start: 0.25rem solid color-mix(in srgb, var(--album-ink) 45%, transparent);
  border-radius: 0.125rem;
  cursor: pointer;
  transition: translate 150ms ease;

  &:hover {
    translate: 0 -0.125rem;
    border-color: var(--album-ink);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-bg-accent-emphasis);
    outline-offset: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      translate: none;
    }
  }
`;

// The set's name, set in the album's engraved serif.
export const PresetName = styled.span`
  font-family: ${SERIF_FONT};
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-fg-default);
`;

// What the set demonstrates, smaller and muted underneath.
export const PresetMeta = styled.span`
  font-size: 0.6875rem;
  color: var(--color-fg-muted);
`;
