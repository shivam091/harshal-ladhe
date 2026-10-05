import { styled } from "@linaria/react";

/*
  The pinned cards themselves sit straight on the cork, not inside an index card — extra padding
  around the grid leaves room for each card's push-pin and tilt so neither clips at the edges.
*/
export const BoardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 17rem), 1fr));
  gap: 1.75rem 1.25rem;
  align-items: start;
  padding: 1rem 0.25rem 0.5rem;

  &[data-single="true"] {
    grid-template-columns: minmax(0, 36rem);
    justify-content: center;
  }
`;

// The tab row on a paper strip of its own, so it stays legible against the cork texture.
export const BoardTabs = styled.div`
  padding-inline: 0.5rem;
  background: color-mix(in srgb, var(--color-fg-attention) 4%, var(--color-bg-default));
  border-radius: 0.125rem;
  box-shadow: 0 0.0625rem 0.125rem color-mix(in srgb, black 18%, transparent);
`;

// Holds the tab strip and the board together as one tab widget.
export const BoardSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-inline-size: 0;
`;
