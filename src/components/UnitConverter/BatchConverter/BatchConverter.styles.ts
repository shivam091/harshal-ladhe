import { styled } from "@linaria/react";

// List input spans the row; unit and prefix sit side by side beneath it, wrapping on a phone.
export const BatchFields = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 0.75rem;
`;

// Monospaced and resizable vertically only, so a pasted scale keeps its columns and never breaks the card's width.
export const BatchTextarea = styled.textarea`
  inline-size: 100%;
  min-block-size: 3.5rem;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--color-fg-attention);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--color-fg-attention) 25%, transparent);
  }
`;

// Same field chrome as the textarea, for the custom-property prefix.
export const TextInput = styled.input`
  inline-size: 100%;
  padding: 0.25rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;

  &:focus {
    outline: none;
    border-color: var(--color-fg-attention);
  }
`;

// Scrolls sideways on a phone rather than squeezing the swatch column to nothing.
export const TableScroller = styled.div`
  overflow-x: auto;
`;

// A real <table> here, unlike the converter rows — these are read-only px/value pairs, which is tabular data.
export const ScaleTable = styled.table`
  inline-size: 100%;
  border-collapse: collapse;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;

  & th {
    padding: 0.25rem 0.5rem;
    font-family: inherit;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-align: start;
    text-transform: uppercase;
    color: var(--color-fg-muted);
    border-block-end: 0.0625rem solid var(--color-border-default);
  }

  & td {
    padding: 0.3125rem 0.5rem;
    color: var(--color-fg-default);
    border-block-end: 0.0625rem dashed var(--color-border-muted);
    white-space: nowrap;
  }

  & td:last-child {
    inline-size: 100%;
  }
`;

// A strip of tape cut to each step's real px length — the scale's rhythm is easier to judge as lengths than as numbers.
export const ScaleSwatch = styled.span`
  display: block;
  max-inline-size: 100%;
  block-size: 0.625rem;
  background-color: var(--tape-colour);
  background-image: repeating-linear-gradient(to right, var(--tape-ink) 0 0.0625rem, transparent 0.0625rem 0.25rem);
  background-size: 100% 0.25rem;
  background-repeat: no-repeat;
  border-radius: 0.0625rem;
`;

// Shown in place of the table when nothing parses, so an empty card explains itself.
export const EmptyNote = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
