import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";

// As many stock cards per row as fit.
export const StockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
  gap: 0.5rem;
`;

/*
  One piece of rolling stock in its box, like a model in a shop display case — a native radio
  underneath for keyboard and screen-reader support, with the checked card lifted onto brass.
*/
export const StockCard = styled.label`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.25rem 0.375rem;
  color: var(--rail-loco);
  background: color-mix(in oklab, var(--rail-felt) 25%, var(--color-bg-default));
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: pointer;

  & input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  & svg {
    display: block;
    overflow: visible;
  }

  &:has(input:checked) {
    border-color: var(--rail-brass);
    box-shadow: 0 0 0 0.125rem color-mix(in oklab, var(--rail-brass) 55%, transparent);
  }

  &:has(input:focus-visible) {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;

// The stock card's name.
export const StockName = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;
