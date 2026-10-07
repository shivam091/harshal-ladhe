import { styled } from "@linaria/react";
import { SERIF_FONT } from "@/components/SvgPathMorph/SvgPathMorph.styles";

// As many jars per row as fit, so six presets wrap evenly at any width.
export const Shelf = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
  gap: 0.625rem;
`;

/*
  A stoppered glass jar: a cork-coloured band across the top (the ::before), a faint accent-tinted
  body, and a lift on hover — suppressed under prefers-reduced-motion.
*/
export const Jar = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  padding: 0.875rem 0.5rem 0.5rem;
  background: linear-gradient(to bottom, var(--bench-glass), color-mix(in oklab, var(--bench-glass) 40%, transparent));
  border: 0.0625rem solid var(--bench-glass-edge);
  border-radius: 0.375rem 0.375rem 0.875rem 0.875rem;
  cursor: pointer;
  transition: transform 150ms ease, border-color 150ms ease;

  &::before {
    content: "";
    position: absolute;
    inset-block-start: -0.3125rem;
    inset-inline: 30%;
    block-size: 0.5rem;
    border-radius: 0.125rem;
    background: color-mix(in oklab, var(--color-fg-attention) 45%, var(--bench-wood-dark));
  }

  &:hover {
    border-color: var(--bench-brass);
    transform: translateY(-0.125rem);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`;

// The jar's contents — the preset's keyframes laid over one another.
export const JarSvg = styled.svg`
  display: block;
  inline-size: 3.5rem;
  block-size: 3.5rem;
`;

// The jar's handwritten label.
export const JarName = styled.span`
  font-family: ${SERIF_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
  color: var(--bench-ink);
`;
