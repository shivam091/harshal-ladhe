import { styled } from "@linaria/react";
import { SERIF_FONT } from "@/components/SvgPathMorph/SvgPathMorph.styles";

// The tab strip, ruled off from the code beneath like a heading on a scroll; scrolls sideways on phones rather than wrapping awkwardly.
export const TabRow = styled.div`
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  border-block-end: 0.0625rem solid var(--bench-parchment-edge);
`;

// One format tab; the active one is underlined in sealing-wax red to stay inside the bench's palette.
export const Tab = styled.button`
  flex: 0 0 auto;
  padding: 0.5rem 0.75rem;
  margin-block-end: -0.0625rem;
  font-family: ${SERIF_FONT};
  font-size: 0.875rem;
  font-weight: 700;
  color: color-mix(in oklab, var(--bench-ink) 60%, var(--color-fg-muted));
  background: transparent;
  border: none;
  border-block-end: 0.1875rem solid transparent;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--bench-ink);
    border-block-end-color: var(--bench-wax);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: -0.125rem;
  }
`;
