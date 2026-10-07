import { styled } from "@linaria/react";
import { DESK_FONT } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";

// As many cards per row as fit.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
  gap: 0.75rem;
`;

// Each preset as a correspondence card propped on the desk — cream stock, a slight tilt that straightens on hover.
export const PresetCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0.5rem 0.625rem;
  font-family: ${DESK_FONT};
  text-align: start;
  color: var(--ld-ink);
  background: var(--ld-paper);
  border: 0.0625rem solid color-mix(in srgb, var(--ld-brass) 35%, transparent);
  border-radius: 0.125rem;
  box-shadow: 0 0.25rem 0.5rem -0.25rem color-mix(in srgb, black 40%, transparent);
  transform: rotate(-0.6deg);
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease;

  &:nth-child(even) {
    transform: rotate(0.6deg);
  }

  &:hover {
    transform: rotate(0deg) translateY(-0.125rem);
    box-shadow: 0 0.5rem 0.75rem -0.375rem color-mix(in srgb, black 45%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The card's thumbnail of the finished drawing.
export const PresetThumb = styled.span`
  display: block;
  block-size: 4.5rem;

  & > svg {
    display: block;
    inline-size: 100%;
    block-size: 100%;
  }
`;

// The card's title in the script hand's plainer cousin.
export const PresetName = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
`;

// A line on what the preset demonstrates.
export const PresetDescription = styled.span`
  font-size: 0.75rem;
  font-style: italic;
  color: color-mix(in srgb, var(--ld-ink) 70%, transparent);
`;
