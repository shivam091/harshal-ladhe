import { styled } from "@linaria/react";
import { MONO_FONT, SERIF_FONT } from "@/components/SvgPathMorph/SvgPathMorph.styles";

// A flask and its hanging tag, stacked; the end-side flask tilts the other way so the pair frames the alembic symmetrically.
export const FlaskFigure = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
  min-inline-size: 0;
`;

/*
  The glass itself: a faint accent-tinted body with a brighter rim, a liquid line in the
  keyframe's elixir colour, a glint on the shoulder, and the matched points drawn over the shape.
*/
export const FlaskSvg = styled.svg`
  display: block;
  inline-size: 100%;
  max-inline-size: 12rem;
  block-size: auto;
  overflow: visible;

  & .glass {
    fill: var(--bench-glass);
    stroke: var(--bench-glass-edge);
    stroke-width: 2.5;
    stroke-linejoin: round;
  }

  & .liquid {
    fill-opacity: 0.22;
  }

  & .glint {
    fill: none;
    stroke: color-mix(in oklab, white 70%, transparent);
    stroke-width: 4;
    stroke-linecap: round;
    opacity: 0.6;
  }

  & .lip {
    fill: var(--bench-glass);
    stroke: var(--bench-glass-edge);
    stroke-width: 2;
  }

  & .point {
    stroke: var(--bench-parchment);
    stroke-width: 0.6%;
  }

  & .start-point {
    stroke: var(--bench-ink);
    stroke-width: 0.9%;
  }
`;

// The parchment tag tied to the flask's neck — the keyframe letter and a one-line tally.
export const FlaskTag = styled.figcaption`
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.25rem 0.625rem;
  background: var(--bench-parchment);
  border: 0.0625rem solid var(--bench-parchment-edge);
  border-radius: 0.125rem 0.375rem 0.125rem 0.375rem;
  box-shadow: 0 0.125rem 0.25rem color-mix(in oklab, black 25%, transparent);
  transform: rotate(-1.5deg);

  [data-side="end"] > & {
    transform: rotate(1.5deg);
  }
`;

// The keyframe letter, inked in its elixir colour.
export const TagLetter = styled.span`
  font-family: ${SERIF_FONT};
  font-size: 1.125rem;
  font-weight: 800;
`;

// The tag's tally — points and subpaths after matching.
export const TagCaption = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  color: color-mix(in oklab, var(--bench-ink) 70%, var(--color-fg-muted));
`;
