import { styled } from "@linaria/react";

// Stacks this panel's own fields with even spacing, same skeleton every other goodie's own control panel uses.
export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// Two fields side by side — column start/span and row start/span each read as a paired spec callout rather than two unrelated stacked fields.
export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
`;

// A typed spec-callout field — monospace and right-aligned, the same voice a real engineering drawing's own dimension figures use, matching GridContainerControls' TrackSizeInput.
export const NumberInput = styled.input`
  inline-size: 100%;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  text-align: right;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.1875rem;

  &:focus {
    outline: none;
    border-color: var(--color-bg-accent-emphasis);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--color-bg-accent-emphasis) 30%, transparent);
  }
`;
