import { styled } from "@linaria/react";

// Two color fields flanking a swap button; wraps on narrow side panels since each field can already run to 8rem+ on its own.
export const ColorsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.5rem;
`;

// Lets each field shrink/grow independently of the fixed-size swap button between them.
export const ColorFieldWrapper = styled.div`
  flex: 1 1 8rem;
  min-inline-size: 0;
`;

// Sits between the two fields, vertically aligned with the swatch/hex row rather than the label above it.
export const SwapButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  padding: 0;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  background: var(--color-bg-muted);
  color: var(--color-fg-muted);
  cursor: pointer;

  &:hover {
    color: var(--color-fg-default);
    background: var(--color-bg-neutral-muted);
  }
`;

// Small printed OKLCH triple under each field — a cheap hint at why the space picker below matters, before the user even touches it.
export const OklchReadout = styled.p`
  margin: 0.25rem 0 0;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  color: var(--color-fg-muted);
`;
