import { styled } from "@linaria/react";
import { CheckboxInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";

// Monospace for denominations, so the byte figures line up down the sheet.
const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// The bulk on/off buttons share a row and wrap on narrow screens.
export const SheetActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

// A sheet of stamps — one column in the narrow intake lane, two once there's width for them.
export const StampSheet = styled.ul`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.625rem;
  margin: 0;
  padding: 0.25rem;
  list-style: none;

  @media (min-width: 30rem) and (max-width: 59.99rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

/*
  One postage stamp: a dotted outline in the card's own colour fakes the perforated edge, and the
  whole stamp is the checkbox's label so a click anywhere on it toggles the pass. Unstuck stamps
  fade to grey; stuck ones take an airmail frame and a postmark cancel across the corner.
*/
export const Stamp = styled.label`
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: 0.25rem 0.5rem;
  padding: 0.5rem 0.625rem;
  background: color-mix(in srgb, var(--color-bg-muted) 70%, var(--po-paper));
  border: 0.125rem solid var(--color-border-muted);
  outline: 0.25rem dotted var(--po-paper);
  outline-offset: -0.0625rem;
  cursor: pointer;
  filter: grayscale(0.8);
  opacity: 0.8;
  transition: filter 200ms ease, opacity 200ms ease, border-color 200ms ease;

  &:has(input:checked) {
    background:
      repeating-linear-gradient(-20deg, transparent 0 0.3rem, color-mix(in srgb, var(--po-ink) 30%, transparent) 0.3rem 0.375rem) right 0.25rem top 0.25rem / 2.5rem 1.25rem no-repeat,
      var(--po-paper);
    border-color: var(--po-airmail-red);
    filter: none;
    opacity: 1;
  }

  &:has(input:focus-visible) {
    box-shadow: 0 0 0 0.375rem var(--color-outline-focus, var(--color-fg-accent));
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The checkbox itself — the shared square toggle, nudged to sit on the label's first line.
export const StampCheckbox = styled(CheckboxInput)`
  margin-block-start: 0.125rem;
`;

// The pass's name, with its short explanation underneath.
export const StampBody = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-inline-size: 0;
`;

// Pass name in the stamp's bold lettering.
export const StampLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;

// What the pass does, in small muted type.
export const StampHint = styled.span`
  font-size: 0.6875rem;
  line-height: 1.35;
  color: var(--color-fg-muted);
`;

/*
  The stamp's denomination — bytes this pass saved. Inked red when it saved something, muted
  when it saved nothing, and labelled "would save" for a stamp not yet stuck on.
*/
export const Denomination = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  text-align: end;
  white-space: nowrap;
  color: var(--color-fg-muted);

  &[data-tone="saved"] {
    color: var(--po-ink);
  }

  &[data-tone="cost"] {
    color: var(--color-fg-attention);
  }

  & > small {
    display: block;
    font-size: 0.5625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
`;

// The counter-clerk's note on bytes saved just by re-wrapping the markup, outside any pass.
export const RoundTripNote = styled.p`
  margin: 0;
  padding-block-start: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  border-block-start: 0.0625rem dashed var(--color-border-muted);
`;
