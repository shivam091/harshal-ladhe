import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/StrokeLab/StrokeLab.styles";

// Five button cards pinned up in a row, wrapping as space runs out.
export const CardRack = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5.75rem, 1fr));
  gap: 0.5rem;
`;

/*
  A button card — the stiff card buttons are sold sewn onto, with two stitch holes at the top and a
  pinked lower edge. The join preview is the "button"; the chosen card is ringed in thread colour.
*/
export const ButtonCard = styled.label`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.375rem 0.75rem;
  background:
    radial-gradient(circle, var(--haber-card-edge) 0 0.09375rem, transparent 0.125rem) 30% 0.3125rem / 0.375rem 0.375rem no-repeat,
    radial-gradient(circle, var(--haber-card-edge) 0 0.09375rem, transparent 0.125rem) 70% 0.3125rem / 0.375rem 0.375rem no-repeat,
    var(--color-bg-default);
  border: 0.0625rem solid var(--haber-card-edge);
  border-radius: 0.25rem 0.25rem 0 0;
  -webkit-mask: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 0.5rem 100%;
  mask: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 0.5rem 100%;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background-color: color-mix(in srgb, var(--haber-thread) 5%, var(--color-bg-default));
  }

  &:has(input:checked) {
    border-color: var(--haber-thread);
    background-color: color-mix(in srgb, var(--haber-thread) 10%, var(--color-bg-default));
  }

  &:has(input:focus-visible) {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: -0.25rem;
  }
`;

// The join preview drawing.
export const JoinSvg = styled.svg`
  display: block;
  inline-size: 4.5rem;
  block-size: auto;
`;

// The keyword under each card's preview.
export const JoinName = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;
