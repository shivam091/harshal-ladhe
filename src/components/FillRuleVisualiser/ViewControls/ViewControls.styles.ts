import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/FillRuleVisualiser/FillRuleVisualiser.styles";

// View mode, toggles and the ray slider in one strip above the panes; wraps into rows on narrow screens.
export const ViewBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  padding: 0.625rem 0.75rem;
  background: color-mix(in oklab, var(--color-bg-default) 94%, var(--glass-amber));
  border: 0.1875rem solid var(--came);
  border-radius: 0.5rem;
`;

// A checkbox styled as a small hinged pane — ticked means the glass is swung into view.
export const Toggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
  cursor: pointer;

  & input {
    inline-size: 1rem;
    block-size: 1rem;
    margin: 0;
    accent-color: var(--glass-cobalt);
    cursor: pointer;
  }

  & input:focus-visible {
    outline: 0.1875rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;

// One slider with its label; grows to share the strip's spare width.
export const SliderField = styled.div`
  display: flex;
  flex: 1 1 11rem;
  flex-direction: column;
  gap: 0.125rem;
  min-inline-size: 9rem;
`;

// The legend under the panes — a row of small glass swatches with what each colour means.
export const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 0.875rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  color: var(--color-fg-default);

  & li {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }
`;

/*
  One legend swatch, a little leaded quarry. The tint is chosen by data-swatch so the colours stay
  in CSS beside the panes' own, rather than being duplicated as inline styles.
*/
export const Swatch = styled.span`
  inline-size: 1.125rem;
  block-size: 1.125rem;
  border: 0.1875rem solid var(--came);
  border-radius: 0.1875rem;
  background: var(--color-bg-default);

  &[data-swatch="1"] {
    background: color-mix(in oklab, var(--glass-cobalt) 55%, var(--color-bg-default));
  }

  &[data-swatch="2"] {
    background: color-mix(in oklab, var(--glass-violet) 65%, var(--color-bg-default));
  }

  &[data-swatch="-1"] {
    background: color-mix(in oklab, var(--glass-emerald) 55%, var(--color-bg-default));
  }

  &[data-swatch="-2"] {
    background: color-mix(in oklab, var(--glass-amber) 65%, var(--color-bg-default));
  }

  &[data-swatch="nonzero"] {
    background: color-mix(in oklab, var(--glass-cobalt) 58%, var(--color-bg-default));
  }

  &[data-swatch="evenodd"] {
    background: color-mix(in oklab, var(--glass-amber) 64%, var(--color-bg-default));
  }

  &[data-swatch="hatch"] {
    background: repeating-linear-gradient(45deg, var(--glass-violet) 0 0.125rem, var(--color-bg-default) 0.125rem 0.35rem);
  }

  &[data-swatch="clear"] {
    background: repeating-linear-gradient(-45deg, color-mix(in oklab, var(--color-fg-muted) 55%, transparent) 0 0.09rem, var(--color-bg-default) 0.09rem 0.35rem);
  }
`;
