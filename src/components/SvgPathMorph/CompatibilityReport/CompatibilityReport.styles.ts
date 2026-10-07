import { styled } from "@linaria/react";
import { MONO_FONT, SERIF_FONT } from "@/components/SvgPathMorph/SvgPathMorph.styles";

// A ruled ledger table — scrolls sideways inside the card on phones rather than squashing the command tallies.
export const Ledger = styled.table`
  display: block;
  inline-size: 100%;
  overflow-x: auto;
  border-collapse: collapse;
  font-size: 0.8125rem;

  & caption {
    padding-block-end: 0.375rem;
    font-family: ${SERIF_FONT};
    font-style: italic;
    text-align: start;
    color: color-mix(in oklab, var(--bench-ink) 70%, var(--color-fg-muted));
  }

  & th,
  & td {
    padding: 0.375rem 0.625rem;
    text-align: start;
    vertical-align: top;
    border-block-end: 0.0625rem solid color-mix(in oklab, var(--bench-parchment-edge) 70%, transparent);
  }

  & thead th {
    font-family: ${SERIF_FONT};
    font-variant: small-caps;
    font-weight: 700;
    white-space: nowrap;
  }

  & tbody th {
    font-family: ${SERIF_FONT};
    font-size: 1rem;
    font-weight: 800;
  }

  & code {
    font-family: ${MONO_FONT};
    font-size: 0.75rem;
  }

  & td span {
    color: var(--color-fg-muted);
  }
`;

// The matcher's working notes, one numbered line per step.
export const StepList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// One step — the glyph tinted by kind so normalising, padding, splitting and turning read as different operations at a glance.
export const Step = styled.li`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.45;

  --step-tone: var(--color-fg-accent);

  &[data-kind="pad"] {
    --step-tone: var(--color-fg-success);
  }

  &[data-kind="subdivide"] {
    --step-tone: var(--color-fg-attention);
  }

  &[data-kind="rotate"],
  &[data-kind="reverse"] {
    --step-tone: var(--bench-wax);
  }

  &[data-kind="close"] {
    --step-tone: var(--color-fg-danger);
  }
`;

// The step's alchemical glyph.
export const StepMark = styled.span`
  flex: 0 0 1.25rem;
  font-size: 0.9375rem;
  text-align: center;
  color: var(--step-tone);
`;

// The travel summary, set apart as the report's bottom line.
export const TravelLine = styled.p`
  margin: 0;
  padding-block-start: 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  border-block-start: 0.0625rem dashed var(--bench-parchment-edge);
`;
