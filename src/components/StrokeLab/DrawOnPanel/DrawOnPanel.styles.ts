import { css } from "@linaria/core";
import { styled } from "@linaria/react";

// Preview beside its timing controls on wide cards, stacked on narrow ones.
export const DrawOnGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 48rem) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }
`;

// The little hoop the preview is stretched in — a round embroidery frame around a scrap of the cutting cloth.
export const Hoop = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: color-mix(in srgb, var(--color-fg-attention) 6%, var(--color-bg-default));
  border: 0.375rem solid var(--haber-wood-dark);
  border-radius: 1.25rem;
  box-shadow: inset 0 0 0 0.125rem color-mix(in srgb, var(--haber-brass) 60%, transparent);
`;

// The preview drawing.
export const PreviewSvg = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: auto;
  max-block-size: 14rem;
`;

/*
  The draw-on keyframe the preview runs. Only the end is given: the start is the element's own
  dashoffset (the whole dash length), exactly as in the exported CSS, so the preview and the export
  share fill-mode behaviour.
*/
export const drawOnStroke = css`
  @keyframes stroke-lab-draw-on {
    to {
      stroke-dashoffset: 0;
    }
  }
`;

// Timing fields in a two-column grid.
export const TimingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 0.75rem;
`;
