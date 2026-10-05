import { styled } from "@linaria/react";

// Title, byte meter and download share one line on wide screens and wrap on phones, with the title always first.
export const HeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;

  & > h3 {
    margin-inline-end: auto;
  }
`;

// Monospace readout so the before/after figures line up like a meter rather than prose.
export const ByteMeter = styled.span`
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-fg-muted);
`;
