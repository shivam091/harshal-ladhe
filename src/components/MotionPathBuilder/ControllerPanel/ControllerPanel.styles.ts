import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";

// The dial and the direction switch side by side across the top of the controller, as on a real one.
export const ControllerTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
`;

// The direction switch's housing: a recessed vertical slot with its three positions stacked.
export const DirectionSlot = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0.375rem;
  min-inline-size: 8rem;
  background: color-mix(in oklab, black 40%, var(--rail-case));
  border: 0.0625rem solid color-mix(in oklab, black 50%, var(--rail-case));
  border-radius: 0.5rem;
  box-shadow: inset 0 0.125rem 0.25rem color-mix(in oklab, black 50%, transparent);

  & legend {
    padding: 0 0.25rem;
    font-family: ${MONO_FONT};
    font-size: 0.6875rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
`;

/*
  One position of the direction switch. The checked position grows a brass lever cap on its
  leading edge, so the switch looks thrown to that position rather than merely highlighted.
*/
export const DirectionPosition = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 0.375rem;
  cursor: pointer;

  &::before {
    content: "";
    inline-size: 0.875rem;
    block-size: 0.875rem;
    border-radius: 50%;
    background: color-mix(in oklab, var(--rail-case-text) 18%, transparent);
    box-shadow: inset 0 0.0625rem 0.125rem color-mix(in oklab, black 60%, transparent);
  }

  & input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  &:has(input:checked) {
    background: color-mix(in oklab, var(--rail-brass) 18%, transparent);
  }

  &:has(input:checked)::before {
    background: radial-gradient(circle at 35% 35%, color-mix(in oklab, white 50%, var(--rail-brass)), var(--rail-brass));
    box-shadow: 0 0 0.375rem color-mix(in oklab, var(--rail-brass) 70%, transparent);
  }

  &:has(input:focus-visible) {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// A labelled group of related controls on the controller, divided from the next by a moulded seam.
export const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding-block-start: 0.75rem;
  border-block-start: 0.0625rem solid color-mix(in oklab, var(--rail-case-text) 14%, transparent);
`;

// Small stencilled heading for a ControlGroup.
export const GroupHeading = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--rail-brass);
`;

// Two short controls side by side (start/end, x/y), stacking on very narrow screens.
export const PairRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: 0.625rem 1rem;
  align-items: end;
`;

// The iteration count field, kept narrow beside its "for ever" checkbox.
export const CountInput = styled.input`
  inline-size: 5rem;
  padding: 0.3125rem 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  color: var(--rail-case-text);
  background: color-mix(in oklab, black 35%, var(--rail-case));
  border: 0.0625rem solid color-mix(in oklab, var(--rail-brass) 40%, var(--rail-case));
  border-radius: 0.25rem;

  &:disabled {
    opacity: 0.5;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;
