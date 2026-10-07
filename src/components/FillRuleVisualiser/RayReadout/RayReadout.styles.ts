import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/FillRuleVisualiser/FillRuleVisualiser.styles";

// The two rules' verdicts side by side; stacks on very narrow cards.
export const RuleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
  gap: 0.5rem;
`;

/*
  One rule's verdict as a small pane of glass: clear while the origin is outside, tinted in that
  rule's own glass (cobalt for nonzero, amber for evenodd) once it's inside.
*/
export const RuleCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.625rem;
  background: color-mix(in oklab, var(--color-bg-default) 92%, var(--color-fg-muted));
  border: 0.1875rem solid var(--came);
  border-radius: 0.375rem;

  &[data-inside="true"][data-rule="nonzero"] {
    background: color-mix(in oklab, var(--color-bg-default) 68%, var(--glass-cobalt));
  }

  &[data-inside="true"][data-rule="evenodd"] {
    background: color-mix(in oklab, var(--color-bg-default) 62%, var(--glass-amber));
  }
`;

// The rule's name, set in the bench's monospace.
export const RuleName = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--color-fg-default);
`;

// The arithmetic line — the running sum for nonzero, the tally and its count for evenodd.
export const Working = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  min-block-size: 1.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.8125rem;
  color: var(--color-fg-default);
`;

// A single ±1 term in the nonzero sum, coloured like the crossing arrow it came from.
export const Term = styled.span`
  padding: 0 0.3rem;
  font-weight: 800;
  border-radius: 0.25rem;
  background: color-mix(in oklab, var(--color-bg-default) 70%, var(--glass-cobalt));

  &[data-sign="-1"] {
    background: color-mix(in oklab, var(--color-bg-default) 65%, var(--glass-emerald));
  }
`;

// The final verdict line under each rule.
export const Verdict = styled.strong`
  font-size: 0.8125rem;
  color: var(--color-fg-default);
`;

// Glazier's tally marks — drawn as SVG so groups of five can carry their diagonal strike.
export const TallySvg = styled.svg`
  display: block;
  block-size: 1.25rem;
  inline-size: auto;
  overflow: visible;

  & line {
    stroke: var(--came);
    stroke-width: 2.25;
    stroke-linecap: round;
  }

  & line[data-strike] {
    stroke: var(--glass-ruby);
  }
`;

// The crossing log, one row per crossing in the order the ray meets them.
export const CrossingTable = styled.table`
  inline-size: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;

  & th,
  & td {
    padding: 0.3rem 0.375rem;
    text-align: start;
    border-block-end: 0.0625rem solid color-mix(in oklab, var(--came) 30%, transparent);
  }

  & th {
    font-family: ${MONO_FONT};
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-fg-muted);
  }

  & td {
    font-family: ${MONO_FONT};
    color: var(--color-fg-default);
  }
`;

// An arrow glyph turned to the edge's drawing direction — the table's echo of the arrow on the glass.
export const DirectionGlyph = styled.span`
  display: inline-block;
  margin-inline-end: 0.25rem;
  font-weight: 800;
  color: var(--glass-cobalt);

  &[data-sign="-1"] {
    color: var(--glass-emerald);
  }
`;

// Keeps a long crossing log from pushing the path editor off screen.
export const TableScroller = styled.div`
  max-block-size: 14rem;
  overflow: auto;
`;
