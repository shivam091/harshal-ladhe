import { styled } from "@linaria/react";
import { DESK_FONT, FIGURE_FONT } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";

/*
  One group of related controls as a brass-rimmed fitting plate — a real <fieldset>, so each group
  is announced with its legend, with a polished rail across the top like a drawer's escutcheon.
*/
export const FittingGroup = styled.fieldset`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
  gap: 0.75rem 1rem;
  margin: 0;
  padding: 0.875rem 0.75rem 0.75rem;
  border: 0.0625rem solid color-mix(in srgb, var(--ld-brass) 55%, transparent);
  border-block-start: 0.25rem solid var(--ld-brass);
  border-radius: 0.375rem;
  background: color-mix(in srgb, var(--ld-brass) 5%, transparent);
`;

// The plate's engraved label.
export const GroupLegend = styled.legend`
  padding: 0 0.375rem;
  font-family: ${DESK_FONT};
  font-size: 0.8125rem;
  font-style: italic;
  font-weight: 700;
  color: color-mix(in srgb, var(--ld-brass) 55%, var(--color-fg-default));
`;

// A checkbox with its label to the right, sized to sit level with the sliders beside it.
export const InlineCheck = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-block-size: 2rem;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  cursor: pointer;
`;

// The seed field and reshuffle fitting on one line.
export const SeedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Numeric entry in tabular figures, used for the shuffle seed.
export const NumberInput = styled.input`
  inline-size: 6rem;
  min-block-size: 2rem;
  padding: 0 0.5rem;
  font-family: ${FIGURE_FONT};
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// A colour override: its checkbox and the picker it enables, side by side.
export const OverrideRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
