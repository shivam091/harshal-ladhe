import { styled } from "@linaria/react";

// Two columns fit the side panel's width without truncating the provenance line.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
`;

// A preset as a small chip footprint — a copper edge on hover marks it as the one about to be "soldered in".
export const PresetCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
  padding: 0.5rem 0.625rem;
  text-align: start;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    border-color: var(--pcb-copper);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-bg-accent-emphasis);
    outline-offset: 0.125rem;
  }
`;

// The preset's own name leads; its provenance sits smaller underneath.
export const PresetName = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-default);
`;

// Provenance tag in muted monospace, echoing the board's silkscreen part numbers.
export const PresetMeta = styled.span`
  font-size: 0.6875rem;
  color: var(--color-fg-muted);
`;
