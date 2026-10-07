import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";

// As many layout plans per row as fit.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
  gap: 0.5rem;
`;

// Each preset as a miniature layout plan: a felt thumbnail with its track, and the name underneath.
export const PresetCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.375rem;
  text-align: start;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--rail-timber-dark);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: transform 150ms ease, box-shadow 150ms ease;

  &:hover {
    transform: translateY(-0.0625rem);
    box-shadow: 0 0.125rem 0 var(--rail-timber-dark);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

// The thumbnail's felt patch.
export const PresetThumb = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 480 / 300;
  background: var(--rail-felt);
  border-radius: 0.125rem;
`;

// The preset's name.
export const PresetName = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;
