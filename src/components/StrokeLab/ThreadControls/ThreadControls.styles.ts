import { styled } from "@linaria/react";
import { SERIF_FONT } from "@/components/StrokeLab/StrokeLab.styles";

// The side-by-side paint-order sample — two letters on a swatch of cloth.
export const PaintOrderDemo = styled.svg`
  display: block;
  inline-size: 100%;
  max-inline-size: 18rem;
  block-size: auto;
  font-family: ${SERIF_FONT};
  background: color-mix(in srgb, var(--color-fg-attention) 6%, var(--color-bg-default));
  border: 0.0625rem dashed var(--haber-card-edge);
  border-radius: 0.25rem;
`;

// Two-up radio row for paint-order, styled as a pair of woven tabs.
export const OrderTabs = styled.div`
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.1875rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--haber-card-edge);
  border-radius: 999rem;
`;

// One paint-order option; the chosen one fills with thread colour.
export const OrderTab = styled.label`
  padding: 0.25rem 0.75rem;
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-muted);
  border-radius: 999rem;
  cursor: pointer;

  &:has(input:checked) {
    color: var(--color-fg-on-emphasis);
    background: var(--haber-thread);
  }

  &:has(input:focus-visible) {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;
