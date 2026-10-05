import { styled } from "@linaria/react";

// A plain list rather than a <table>, since each row's real content is a form field and its label, not tabular data.
export const RowList = styled.div`
  display: grid;
  gap: 0.375rem;
`;

/*
  Unit tag · input · basis on wide screens; on a phone the basis drops under the input so the field
  keeps a usable width. The source row gets a tape-yellow edge, marking which number every other
  row is being worked out from.
*/
export const Row = styled.div`
  display: grid;
  grid-template-columns: 3.25rem minmax(0, 1fr);
  grid-template-areas:
    "tag field"
    "tag basis";
  align-items: center;
  column-gap: 0.625rem;
  row-gap: 0.125rem;
  padding: 0.375rem 0.5rem;
  border: 0.0625rem solid var(--color-border-muted);
  border-inline-start-width: 0.25rem;
  border-radius: 0.25rem;
  background: var(--color-bg-default);

  &[data-source="true"] {
    border-inline-start-color: var(--color-fg-attention);
    background: color-mix(in srgb, var(--color-fg-attention) 8%, var(--color-bg-default));
  }

  @media (min-width: 36rem) {
    grid-template-columns: 3.25rem minmax(0, 1fr) 9rem;
    grid-template-areas: "tag field basis";
  }
`;

// Looks like a cloth label stitched on — the unit is the row's identity, so it gets the heaviest weight.
export const UnitTag = styled.label`
  grid-area: tag;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  block-size: 1.75rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-fg-default);
  background: var(--tape-colour);
  border: 0.0625rem dashed color-mix(in srgb, var(--color-fg-default) 30%, transparent);
  border-radius: 0.1875rem;
  cursor: text;
`;

// Monospaced so digits line up down the column and a changing value doesn't shuffle the row's width.
export const ValueInput = styled.input`
  grid-area: field;
  inline-size: 100%;
  min-inline-size: 0;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.9375rem;
  color: var(--color-fg-default);
  background: transparent;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;

  &:focus {
    outline: none;
    border-color: var(--color-fg-attention);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--color-fg-attention) 25%, transparent);
  }
`;

// The ratio this row is converted through — shown so the answer can be checked by hand.
export const Basis = styled.span`
  grid-area: basis;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 36rem) {
    text-align: end;
  }
`;
