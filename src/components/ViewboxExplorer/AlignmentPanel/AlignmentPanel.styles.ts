import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";

// The 3 × 3 alignment pad beside its meet/slice switch, stacking on narrow trays.
export const AlignLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.75rem 1rem;
`;

// Nine positions as an enlarger's easel-positioning grid: a square plate split into cells.
export const AlignGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 2.75rem);
  grid-template-rows: repeat(3, 2.75rem);
  gap: 0.25rem;
  padding: 0.25rem;
  background: color-mix(in srgb, black 20%, var(--color-bg-default));
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
`;

/*
  One alignment cell — a tiny paper with a dot pinned where the drawing would be anchored. The dot
  sits at the cell's own alignment position via CSS variables, so the grid reads as a map of where
  the leftover space goes.
*/
export const AlignCell = styled.button`
  position: relative;
  padding: 0;
  background: color-mix(in srgb, var(--color-bg-default) 80%, white);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;

  &::after {
    content: "";
    position: absolute;
    inset-inline-start: calc(0.3rem + (100% - 1.2rem) * var(--dot-x));
    inset-block-start: calc(0.3rem + (100% - 1.2rem) * var(--dot-y));
    inline-size: 0.6rem;
    block-size: 0.6rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--color-fg-muted) 60%, transparent);
  }

  &:hover {
    border-color: var(--safelight);
  }

  &[aria-pressed="true"] {
    background: color-mix(in srgb, var(--safelight) 22%, var(--color-bg-default));
    border-color: var(--safelight);
  }

  &[aria-pressed="true"]::after {
    background: var(--safelight);
    box-shadow: 0 0 0.375rem var(--safelight);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus, var(--color-fg-accent));
    outline-offset: 0.0625rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The meet/slice switch and the none button, stacked as a column of labelled keys.
export const ModeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-inline-size: 11rem;
  flex: 1 1 11rem;
`;

// The current attribute value spelt out under the pad, in safelight ink.
export const AttributeValue = styled.output`
  display: block;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--safelight-ink);
  overflow-wrap: anywhere;
`;

// Tour controls on one row, with the step counter pushed to the end.
export const TourRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
`;

// "7 / 19" — which stop the tour is on.
export const TourCounter = styled.span`
  margin-inline-start: auto;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
