import { styled } from "@linaria/react";
import { SERIF_FONT } from "@/components/SvgPathMorph/SvgPathMorph.styles";

/*
  Flask, alembic, flask in a row on wide screens; on narrow ones the alembic takes the full width
  first and the two flasks sit side by side beneath it, so the morph itself is never pushed below the fold.
*/
export const BenchTop = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-areas:
    "alembic alembic"
    "start end";
  align-items: end;
  justify-items: center;
  gap: 0.5rem 1rem;
  padding-block: 0.5rem;

  & > :nth-child(1) {
    grid-area: start;
  }

  & > :nth-child(2) {
    grid-area: alembic;
  }

  & > :nth-child(3) {
    grid-area: end;
  }

  @media (min-width: 48rem) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr) minmax(0, 1fr);
    grid-template-areas: "start alembic end";
  }
`;

// The astrolabe beside its controls on wide screens, stacked on narrow ones.
export const Instruments = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem 1.5rem;
  align-items: center;

  @media (min-width: 40rem) {
    grid-template-columns: auto minmax(0, 1fr);
  }
`;

// Centres the dial and its readout as one unit.
export const DialColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

// The sliders, easing picker and switches beside the dial.
export const ControlsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  min-inline-size: 0;
`;

// Label-over-control wrapper for the easing picker, matching the sliders' rhythm.
export const SelectField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

// The picker's label, sized like the slider labels so the column reads as one set.
export const SelectLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

// A native select dressed as a parchment slip — native, so keyboard and screen-reader behaviour come for free.
export const Select = styled.select`
  min-block-size: 2.25rem;
  padding: 0.25rem 0.5rem;
  font-family: ${SERIF_FONT};
  font-size: 0.875rem;
  color: var(--bench-ink);
  background: var(--bench-parchment);
  border: 0.0625rem solid var(--bench-parchment-edge);
  border-radius: 0.25rem;

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;
