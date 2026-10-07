import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";

// The four viewBox numbers in attribute order, two per row on narrow trays and four across on wide ones.
export const NumberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;

  @media (min-width: 30rem) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

// A labelled number field — label above, like the rest of the site's demo controls.
export const NumberField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

// Number input styled as a dial window on the easel's scale bar.
export const NumberInput = styled.input`
  inline-size: 100%;
  min-inline-size: 0;
  padding: 0.375rem 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus, var(--color-fg-accent));
    outline-offset: 0.0625rem;
    border-color: var(--safelight);
  }
`;

// The overlay switches, as a wrapped row of checkboxes with their labels.
export const ToggleRow = styled.fieldset`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 1rem;
  margin: 0;
  padding: 0;
  border: 0;

  & legend {
    padding: 0;
    margin-block-end: 0.375rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-fg-muted);
  }

  & label {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: var(--color-fg-default);
    cursor: pointer;
  }

  & input {
    accent-color: var(--safelight);
  }
`;
