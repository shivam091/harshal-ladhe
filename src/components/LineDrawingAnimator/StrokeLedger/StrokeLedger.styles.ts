import { styled } from "@linaria/react";
import { DESK_FONT, FIGURE_FONT } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";

/*
  The ink-blotter ledger: a pad of soft blotting paper held by leather corner pockets (the two
  triangular pseudo-elements), with a red margin rule down the left like a bookkeeper's ledger.
*/
export const Blotter = styled.div`
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(90deg, transparent 2.75rem, var(--ld-margin) 2.75rem calc(2.75rem + 1px), transparent calc(2.75rem + 1px)),
    var(--ld-blotter);
  border: 0.0625rem solid color-mix(in srgb, var(--color-fg-success) 25%, var(--color-border-default));
  border-radius: 0.25rem;

  &::before,
  &::after {
    content: "";
    position: absolute;
    inline-size: 1.5rem;
    block-size: 1.5rem;
    pointer-events: none;
    z-index: 1;
  }

  &::before {
    inset-block-start: 0;
    inset-inline-start: 0;
    background: linear-gradient(135deg, color-mix(in srgb, var(--ld-wood-grain) 70%, black) 50%, transparent 50%);
  }

  &::after {
    inset-block-end: 0;
    inset-inline-end: 0;
    background: linear-gradient(-45deg, color-mix(in srgb, var(--ld-wood-grain) 70%, black) 50%, transparent 50%);
  }
`;

// The ledger's lines — an ordered list, since the sequence is exactly what it records; scrolls once a drawing has more strokes than fit.
export const LedgerList = styled.ol`
  max-block-size: 28rem;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
`;

/*
  One ledger line. Focusable, so Alt+↑/↓ can move it; the drag-over and current-stroke states tint
  it like ink soaking into blotting paper.
*/
export const LedgerRow = styled.li`
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.25rem 0.625rem;
  padding: 0.375rem 0.625rem 0.375rem 0;
  border-block-end: 0.0625rem solid color-mix(in srgb, var(--color-fg-accent) 18%, transparent);
  cursor: grab;

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: -0.125rem;
  }

  &[data-drop-target="true"] {
    background: color-mix(in srgb, var(--ld-ink) 12%, transparent);
  }

  &[data-excluded="true"] > :not(:first-child, :last-child) {
    opacity: 0.5;
    text-decoration: line-through;
  }
`;

// The line number in the margin, set like a ledger's folio figures.
export const RowNumber = styled.span`
  font-family: ${FIGURE_FONT};
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  text-align: center;
  color: var(--ld-margin);
`;

// The stroke's description and its timing, stacked.
export const RowBody = styled.div`
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
`;

// Element tag and geometry summary, in the desk's italic hand.
export const RowLabel = styled.span`
  overflow: hidden;
  font-family: ${DESK_FONT};
  font-size: 0.8125rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--color-fg-default);

  & code {
    font-family: ${FIGURE_FONT};
    font-size: 0.75rem;
    color: var(--color-fg-muted);
  }
`;

// Start time and duration, in figures.
export const RowMeta = styled.span`
  font-family: ${FIGURE_FONT};
  font-size: 0.6875rem;
  color: var(--color-fg-muted);
`;

// The row's small fittings: include, move up, move down, tweak.
export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// A small round brass stud for the ledger's per-row actions.
export const StudButton = styled.button`
  display: inline-grid;
  place-items: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--ld-brass) 20%, black);
  background: radial-gradient(circle at 35% 30%, var(--ld-brass-light), var(--ld-brass) 60%, var(--ld-brass-dark));
  border: 0.0625rem solid var(--ld-brass-dark);
  border-radius: 50%;
  cursor: pointer;

  &[aria-expanded="true"] {
    box-shadow: inset 0 0.0625rem 0.1875rem color-mix(in srgb, black 40%, transparent);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// The per-stroke tweak drawer, spanning the row under its description.
export const TweakDrawer = styled.div`
  grid-column: 2 / -1;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.5rem 0.75rem;
  padding-block: 0.375rem 0.25rem;
`;

// A compact labelled field inside the tweak drawer.
export const TweakField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-fg-muted);

  & input[type="number"] {
    inline-size: 5.5rem;
    min-block-size: 1.75rem;
    padding: 0 0.375rem;
    font-family: ${FIGURE_FONT};
    font-size: 0.75rem;
    color: var(--color-fg-default);
    background: var(--color-bg-default);
    border: 0.0625rem solid var(--color-border-default);
    border-radius: 0.25rem;
  }

  & input[type="color"] {
    inline-size: 3rem;
    block-size: 1.75rem;
    padding: 0;
    border: 0.0625rem solid var(--color-border-default);
    background: transparent;
  }
`;

// The ledger's footer: what the keyboard can do, and the clear-all fitting.
export const LedgerFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;
