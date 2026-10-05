import { styled } from "@linaria/react";

// Title on one side, the remove button on the other.
export const InspectorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

// Small outlined "Remove" button — quiet until hovered, since deleting is the least common thing done here.
export const RemoveButton = styled.button`
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: var(--color-fg-danger);
    border-color: var(--color-fg-danger);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--sheet-pencil);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// The pinnable-property list, ruled off row by row like the lines down an exposure sheet.
export const PropertyList = styled.div`
  display: flex;
  flex-direction: column;
  border-block-start: 0.0625rem dashed var(--sheet-rule);
`;

// One property — its pin checkbox, and (once pinned) the control for its value underneath.
export const PropertyRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding-block: 0.5rem;
  border-block-end: 0.0625rem dashed var(--sheet-rule);

  &[data-pinned="true"] {
    background: linear-gradient(to right, color-mix(in srgb, var(--sheet-pencil) 8%, transparent), transparent 70%);
  }
`;

// Checkbox and its label side by side; the trailing hint says what an unpinned property does instead.
export const PinLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
  cursor: pointer;

  & > span:last-child {
    margin-inline-start: auto;
    font-size: 0.6875rem;
    font-weight: 500;
    color: var(--color-fg-muted);
  }
`;

// Colour input plus its hex readout on one line.
export const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  & > input {
    flex: 1 1 auto;
  }

  & > code {
    font-size: 0.75rem;
  }
`;
