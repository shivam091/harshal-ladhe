import { styled } from "@linaria/react";

// Row of type choices rendered as a strip of small caption tabs — an underline marks the active one, matching this theme's "rule, not fill" language for selection state.
export const TypeRow = styled.div`
  display: flex;
  gap: 0.125rem;
  border-block-end: 0.0625rem solid var(--color-border-muted);
`;

// One gradient-type tab inside TypeRow.
export const TypeButton = styled.button`
  padding: 0.375rem 0.625rem;
  margin-block-end: -0.0625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-block-end: 0.125rem solid transparent;
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease;

  &[data-selected="true"] {
    color: var(--color-fg-default);
    border-block-end-color: var(--color-fg-default);
  }

  &:not([data-selected="true"]):hover {
    color: var(--color-fg-default);
  }
`;

// Vertical list of gradient stops, each its own ruled row rather than a boxed card.
export const StopList = styled.div`
  display: flex;
  flex-direction: column;
`;

// One stop's color/position/remove trio, separated from its neighbors by a hairline rather than a gap+border card, matching the manuscript spec-sheet row language used elsewhere in this tool.
export const StopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-block: 0.375rem;

  &:not(:last-of-type) {
    border-block-end: 0.0625rem solid var(--color-border-muted);
  }
`;

// Small square color swatch for one stop — deliberately compact since a stop's color is secondary to its position in this list's reading order.
export const StopColorInput = styled.input`
  flex: 0 0 auto;
  appearance: none;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0;
  background: transparent;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0.125rem;
  }

  &::-webkit-color-swatch {
    border: none;
  }
`;

// Numeric position field, formatted like a percentage annotated on a spec sheet — monospace so a column of these stays vertically aligned.
export const StopPositionInput = styled.input`
  flex: 1 1 auto;
  min-inline-size: 0;
  padding: 0.25rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0;

  &:focus {
    outline: none;
    border-color: var(--color-fg-default);
  }
`;

// Removes a stop — an "x" struck through rather than a filled trash icon button, reading as a proofreader's deletion mark.
export const StopRemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-danger);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

// Dashed-rule "add another stop" button, sitting below the stop list like a note appended at the foot of a column.
export const AddStopButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-block-start: 0.5rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0.0625rem dashed var(--color-border-default);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease;

  &:hover {
    color: var(--color-fg-default);
    border-color: var(--color-fg-default);
  }
`;
