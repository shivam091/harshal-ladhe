import { styled } from "@linaria/react";

// The OKLCH/RGB-mix algorithm switch — a small row of ticket tabs matching ExportPanel's own format switcher, styled like a two-recipe ink formula choice.
export const RecipeRow = styled.div`
  display: inline-flex;
  gap: 0.125rem;
  padding: 0.1875rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
`;

// One recipe's own tab, raised with the accent fill while active.
export const RecipeTab = styled.button`
  padding: 0.3125rem 0.625rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-radius: 0.1875rem;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
  }

  &:not([data-selected="true"]):hover {
    color: var(--color-fg-default);
  }
`;

/*
  The flagship flourish's stage: reserves room for the fanned stack below (chips pivot from its
  bottom-center edge and swing outward/upward) plus headroom for a lifted chip, and centers the
  whole fan horizontally regardless of how many steps the current ramp has.
*/
export const RampFan = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-block-size: 11.5rem;
  padding-block-start: 3.5rem;
  padding-inline: 2.5rem;
`;

/*
  One swatch chip in the fan. Every chip shares the exact same anchor point (bottom-center, via
  inset-block-end/inset-inline-start/margin-inline-start below) with only its rotation differing —
  the same trick a real hand-fanned stack of paint chips or playing cards uses: a single pivot plus
  a spread of angles is enough to make every step's own top edge (where ChipTab's label sits) peek
  out from beneath the step after it. Resting rotation and the hover/select "pulled clear" transform
  are both applied as inline style overrides from RampDisplay.tsx (computed per-step, and per-index
  for resting angle) rather than CSS attribute selectors, since both are numeric functions of a
  swatch's position in the ramp rather than a fixed small set of variants.
*/
export const RampChip = styled.button`
  position: absolute;
  inset-block-end: 0;
  inset-inline-start: 50%;
  inline-size: 4.25rem;
  block-size: 6rem;
  margin-inline-start: -2.125rem;
  transform-origin: bottom center;
  padding: 0;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem 0.375rem 0.125rem 0.125rem;
  box-shadow: var(--box-shadow-sm);
  cursor: pointer;
  transition: transform 220ms cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 220ms ease;

  &:hover,
  &:focus-visible {
    box-shadow: var(--box-shadow-md);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus);
    outline-offset: 0.125rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 220ms ease;
  }
`;

// The step's own lightness-step number, printed on a tab that stays legible on the sliver of each chip the one after it doesn't cover — a dark, semi-opaque pill reads against any swatch color, unlike plain text set directly in the swatch's own (highly variable) hue/lightness.
export const ChipTab = styled.span`
  position: absolute;
  inset-block-start: 0.375rem;
  inset-inline-start: 50%;
  transform: translateX(-50%);
  padding: 0.0625rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.625rem;
  font-weight: 700;
  color: #fff;
  background: color-mix(in srgb, #000 42%, transparent);
  border-radius: 0.1875rem;
  pointer-events: none;
`;

// Detail readout below the fan for whichever chip is currently lifted (hovered, focused, or pinned by a click) — empty-state prose when nothing is active.
export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
`;

// Placeholder prose shown while no chip is hovered, focused, or pinned.
export const DetailEmpty = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;

// Top row of the detail card — the swatch dot, its step name, and its hex code.
export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

// A small solid swatch mirroring the lifted chip's own color, so the detail readout doesn't rely on the fan itself staying in view.
export const DetailSwatch = styled.span`
  inline-size: 1.75rem;
  block-size: 1.75rem;
  flex: 0 0 auto;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

// The active step's own label, e.g. "Step 500".
export const DetailName = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-fg-default);
`;

// The active step's exact hex code.
export const DetailHex = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;

// Row of the detail card's own measurements — OKLCH coordinates plus contrast against both halves of the current pair.
export const DetailStatRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.125rem;
`;

// One measurement's own label/value pair.
export const DetailStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

// A measurement's own small uppercase caption.
export const DetailStatLabel = styled.span`
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-fg-muted);
`;

// A measurement's own numeric readout, set in the same monospace as the hex code above it.
export const DetailStatValue = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;

// Sends the lifted chip's own hex straight to the contrast checker's background field — the one place the fan and the QC stamp meet.
export const UseBackgroundButton = styled.button`
  align-self: flex-start;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-on-emphasis);
  background: var(--color-bg-accent-emphasis);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: filter 150ms ease;

  &:hover {
    filter: brightness(1.08);
  }
`;
