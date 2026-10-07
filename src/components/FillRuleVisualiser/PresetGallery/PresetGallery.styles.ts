import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/FillRuleVisualiser/FillRuleVisualiser.styles";

// As many sample panes per row as fit; eight presets wrap evenly at most widths.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
  gap: 0.5rem;
`;

// Each preset as a sample window leaned against the bench: a leaded thumbnail over its name.
export const PresetCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.375rem;
  text-align: start;
  color: var(--color-fg-default);
  background: color-mix(in oklab, var(--color-bg-default) 92%, var(--glass-amber));
  border: 0.1875rem solid var(--came);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 150ms ease, background-color 150ms ease;

  &:hover {
    background: color-mix(in oklab, var(--color-bg-default) 80%, var(--glass-amber));
    transform: translateY(-0.0625rem);
  }

  &:focus-visible {
    outline: 0.1875rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover {
      transform: none;
    }
  }
`;

/*
  The thumbnail: the preset rendered twice on a tiny light table, nonzero on the left and evenodd
  on the right, so the difference each preset teaches is visible before it's loaded.
*/
export const Thumb = styled.svg`
  display: block;
  inline-size: 100%;
  aspect-ratio: 2 / 1;
  background: color-mix(in oklab, var(--glass-amber) 8%, var(--color-bg-default));
  border-radius: 0.25rem;

  & .thumb-nonzero {
    fill: var(--pane-nonzero);
    stroke: var(--came);
    stroke-width: 10;
    stroke-linejoin: round;
  }

  & .thumb-evenodd {
    fill: var(--pane-evenodd);
    stroke: var(--came);
    stroke-width: 10;
    stroke-linejoin: round;
  }

  & .thumb-mullion {
    stroke: var(--came);
    stroke-width: 10;
  }
`;

// The preset's name, stamped in the bench's monospace.
export const PresetName = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 700;
`;

// One-line teaser of what the preset demonstrates.
export const PresetBlurb = styled.span`
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--color-fg-muted);
`;
