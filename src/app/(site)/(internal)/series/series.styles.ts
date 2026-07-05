import { styled } from "@linaria/react";

// Series page section wrapper — intro paragraph sits above the card feed.
export const SeriesSection = styled.section`
  p {
    font-size: var(--fluid-font-size-md);
    line-height: var(--line-height-relaxed);
    margin-block-end: var(--fluid-space-base);
  }
`;

// Vertical feed of series cards.
export const SeriesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--fluid-space-base);
  margin: var(--space-none);
  padding: var(--space-none);
  list-style: none;
`;

/*
  A single series card. position:relative anchors the title link's stretched
  ::after overlay so a click anywhere on the card opens the series.
*/
export const SeriesCard = styled.li`
  position: relative;
  background: var(--color-bg-default);
  border: var(--border-width-default) solid var(--color-border-default);
  border-radius: var(--border-radius-default);
  padding: var(--fluid-space-base);
  margin-block-end: var(--space-none);
  box-shadow: var(--box-shadow-sm);
  transition: box-shadow var(--motion-duration-medium) var(--motion-easing-ease);

  &:hover {
    @media (hover: hover) {
      box-shadow: var(--box-shadow-md);
    }
  }
`;

// Card header — title and optional excerpt.
export const SeriesCardHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-block-end: var(--space-sm);
`;

/*
  Series title link — accent colour, no underline; the ::after stretches
  invisibly over the whole card so a click anywhere navigates to the series.
*/
export const SeriesCardTitle = styled.h2`
  font-size: var(--font-size-lg);
  margin-block-start: var(--space-none);

  a {
    color: var(--color-fg-default);
    text-decoration: none;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 0;
    }
  }
`;

// Short lead text under the title — muted, medium weight.
export const SeriesCardExcerpt = styled.div`
  color: var(--color-fg-muted);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-md);
`;

// Card body — description with a 2-line clamp.
export const SeriesCardBody = styled.div`
  margin-block-start: var(--space-md);
`;

export const SeriesCardDescription = styled.div`
  color: var(--color-fg-muted);
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

// Card footer — part count.
export const SeriesCardFooter = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: var(--space-sm);
  margin-block-start: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--color-fg-muted);
`;
