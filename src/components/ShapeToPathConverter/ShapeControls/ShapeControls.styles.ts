import { styled } from "@linaria/react";
import { HAND_FONT, MONO_FONT } from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";

// A fieldset with its native border removed; the worksheet card already frames it.
export const ControlGroup = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  border: 0;
  min-inline-size: 0;
`;

// A fieldset legend in the same handwritten pencil as the working's sub-headings.
export const GroupLegend = styled.legend`
  padding: 0;
  margin-block-end: 0.375rem;
  font-family: ${HAND_FONT};
  font-size: 0.875rem;
  color: var(--book-pencil);
`;

// The six shape tags in a three-by-two grid, one radio each.
export const KindGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.375rem;
`;

/*
  A shape tag as a selectable tab. The real radio sits visually hidden inside, so arrow keys move
  between shapes natively and the selected tag is ringed in red pen, like a circled answer.
*/
export const KindOption = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: 2.25rem;
  padding: 0 0.25rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  color: var(--book-ink);
  background: var(--color-bg-default);
  border: 0.0625rem solid color-mix(in srgb, var(--book-pencil) 50%, transparent);
  border-radius: 0.375rem;
  cursor: pointer;

  & input {
    position: absolute;
    opacity: 0;
    inset: 0;
    margin: 0;
    cursor: pointer;
  }

  &:has(input:checked) {
    border-color: var(--book-pen);
    box-shadow: 0 0 0 0.0625rem var(--book-pen);
    color: var(--book-pen);
    font-weight: 700;
  }

  &:has(input:focus-visible) {
    outline: 0.125rem solid var(--book-ink);
    outline-offset: 0.125rem;
  }
`;

// Attribute inputs two to a row, the way "x = …, y = …" pairs are written side by side.
export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem 0.75rem;
`;

// One attribute: its name above a numeric input.
export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
  min-inline-size: 0;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

// Inputs written on a single ruled line rather than in a box, as answers are filled in on a worksheet.
export const NumberInput = styled.input`
  inline-size: 100%;
  min-inline-size: 0;
  padding: 0.25rem 0.125rem;
  font-family: ${MONO_FONT};
  font-size: 0.875rem;
  color: var(--book-ink);
  background: transparent;
  border: 0;
  border-block-end: 0.0625rem solid var(--book-pencil);
  border-radius: 0;

  &:focus-visible {
    outline: none;
    border-block-end: 0.125rem solid var(--book-ink);
  }

  &:disabled {
    color: var(--color-fg-muted);
    border-block-end-style: dotted;
  }
`;

// The "auto" tick box beside rx/ry.
export const AutoToggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: system-ui, sans-serif;
  font-size: 0.6875rem;
  color: var(--color-fg-muted);

  & input {
    accent-color: var(--book-ink);
    margin: 0;
  }
`;

// The points list, typed in the post's "x,y x,y" pairing.
export const PointsInput = styled.textarea`
  inline-size: 100%;
  min-block-size: 4.5rem;
  padding: 0.375rem 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--book-ink);
  background: color-mix(in srgb, var(--color-bg-default) 85%, transparent);
  border: 0.0625rem solid var(--book-pencil);
  border-radius: 0.25rem;
  resize: vertical;

  &[aria-invalid="true"] {
    border-color: var(--book-pen);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--book-ink);
    outline-offset: 0.0625rem;
  }
`;

// Add/remove point buttons, side by side under the points list.
export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

// A small pencil-outlined button for list edits.
export const SmallButton = styled.button`
  min-block-size: 1.875rem;
  padding: 0 0.625rem;
  font-size: 0.75rem;
  color: var(--book-ink);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--book-pencil);
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--book-ink);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--book-ink);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// The red-pen correction under an invalid points list.
export const FieldError = styled.p`
  margin: 0;
  font-family: ${HAND_FONT};
  font-size: 0.8125rem;
  color: var(--book-pen);
`;

// Absolute/relative as two radio pills on one line.
export const SegmentRow = styled.div`
  display: flex;
  gap: 0.375rem;
`;

// A select drawn on the same ruled line as the number inputs.
export const SelectInput = styled.select`
  inline-size: 100%;
  padding: 0.25rem 0.125rem;
  font-size: 0.8125rem;
  color: var(--book-ink);
  background: var(--color-bg-default);
  border: 0;
  border-block-end: 0.0625rem solid var(--book-pencil);

  &:focus-visible {
    outline: 0.125rem solid var(--book-ink);
    outline-offset: 0.125rem;
  }
`;
