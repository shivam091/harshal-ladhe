import { styled } from "@linaria/react";

// Free-text input for the animation name, matching DemoControlField's square select treatment so the two read as one form.
export const TextInput = styled.input`
  inline-size: 100%;
  padding: 0.25rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0;

  &:focus {
    outline: none;
    border-color: var(--sheet-pencil);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--sheet-pencil) 30%, transparent);
  }

  &:disabled {
    opacity: 0.5;
  }
`;

// The sanitised identifier the export will actually use, shown under the field whenever it differs from what was typed.
export const NameHint = styled.span`
  font-size: 0.6875rem;
  color: var(--color-fg-muted);

  & > code {
    font-size: inherit;
  }
`;

// Two selects per row once the card is wide enough, so direction/fill and the like pair up visually.
export const FieldPair = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 0.75rem;
`;

// Iteration count's number field and its "infinite" checkbox on one line.
export const IterationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  & > input[type="number"] {
    inline-size: 5rem;
  }
`;

// Label for the "infinite" checkbox beside the number field.
export const InlineCheckLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
  cursor: pointer;
`;
