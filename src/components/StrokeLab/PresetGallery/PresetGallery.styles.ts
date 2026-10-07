import { styled } from "@linaria/react";
import { MONO_FONT, SERIF_FONT } from "@/components/StrokeLab/StrokeLab.styles";

// As many thread cards per row as fit.
export const Drawer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 0.5rem;
`;

/*
  A thread card — the notched cardboard bobbin thread is wound on in a haberdasher's drawer, with
  the preset's own stitch drawn across it as the sample.
*/
export const ThreadCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0.625rem 0.625rem;
  text-align: start;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--haber-card-edge);
  border-radius: 0.25rem;
  clip-path: polygon(0 0, 42% 0, 50% 0.375rem, 58% 0, 100% 0, 100% 100%, 58% 100%, 50% calc(100% - 0.375rem), 42% 100%, 0 100%);
  cursor: pointer;
  transition: border-color 150ms ease, background-color 150ms ease;

  &:hover {
    border-color: var(--haber-thread);
    background-color: color-mix(in srgb, var(--haber-thread) 5%, var(--color-bg-default));
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: -0.25rem;
  }
`;

// The stitch sample drawn across the card.
export const SampleSvg = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: 1.5rem;
`;

// The card's name in the shop serif.
export const CardName = styled.span`
  font-family: ${SERIF_FONT};
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;

// One line on what the preset teaches.
export const CardBlurb = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  line-height: 1.4;
  color: var(--color-fg-muted);
`;
