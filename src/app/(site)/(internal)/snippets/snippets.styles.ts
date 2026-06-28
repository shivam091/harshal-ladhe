import { styled } from "@linaria/react";
import { hoverShadowLiftCss, stretchedCardLinkCss } from "@/components/common.styles";

// Intro copy above the snippet grid.
export const SnippetsSection = styled.section`
  p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    line-height: 1.625;
    margin-block-end: clamp(1rem, 1.25vw, 1.5rem);
  }
`;

/*
  Responsive auto-filling card grid — each card is at least 22rem wide.
  Implicit rows cycle through a 3-track title/description/meta band
  (grid-auto-rows' pattern repeats every 3 tracks), and every card subgrids
  into exactly one of those bands — see Snippet below — so a card's title,
  description, and meta rows line up with its neighbours' on the same line.
*/
export const SnippetsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  grid-auto-rows: auto 1fr auto;
  gap: 1rem;
  margin-block-start: 1rem;
  padding: 0;
  list-style: none;
`;

/*
  A single snippet card. Spans the 3-track title/description/meta band from
  SnippetsList and subgrids its own rows to it, so the description row (the
  shared 1fr track) stretches to push the meta block down to a baseline
  shared with every other card on the same line, regardless of how much
  title/description text each one has. position: relative anchors the title
  link's stretched ::after overlay (see SnippetName) to the whole card.
*/
export const Snippet = styled.li`
  position: relative;
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
  row-gap: 0.5rem;
  padding: 1rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  margin-block-end: 0;
  ${hoverShadowLiftCss}
`;

/*
  Snippet title link — occupies the band's first (auto) row. The whole card
  is clickable via the title link's stretched ::after overlay (same pattern
  as PostCardTitle/RelatedPosts/SeriesList), so no anchor wraps the
  description or meta block below it.
*/
export const SnippetName = styled.h2`
  font-size: 1.25rem;
  margin-block-start: 0;

  ${stretchedCardLinkCss}
`;

// Occupies the band's middle (1fr) row, so it stretches to fill leftover space.
export const SnippetDescription = styled.div`
  color: var(--color-fg-muted);
`;

// Tinted pill at the bottom of the card showing category and last-modified date.
export const SnippetMeta = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  background: var(--color-bg-cloud-300);
  border-radius: 0.1875rem;
  color: var(--color-fg-accent-muted);
`;

// Individual meta row — adds bottom margin between items except the last.
export const SnippetMetaItem = styled.span`
  font-size: 0.875rem;

  &:not(:last-child) {
    margin-block-end: 0.5rem;
  }
`;
