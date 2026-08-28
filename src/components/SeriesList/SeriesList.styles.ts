import { styled } from "@linaria/react";
import { clampedDescriptionCss, dotSeparatorCss, hoverShadowLiftCss, stretchedCardLinkCss } from "@/components/common.styles";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Vertical feed of series cards.
export const SeriesFeed = styled.ul`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 1.25vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
`;

// Anchors the title link's stretched overlay so a click anywhere on the card opens the series.
export const SeriesPreview = styled.li`
  position: relative;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  padding: clamp(1rem, 1.25vw, 1.5rem);
  margin-block-end: 0;
  ${hoverShadowLiftCss}
`;

// Card header — title and optional excerpt.
export const SeriesCardHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-block-end: 0.5rem;
`;

// Carries the stretched overlay so the whole card works as one link.
export const SeriesCardTitle = styled.h2`
  font-size: 1.25rem;
  margin-block-start: 0;

  ${stretchedCardLinkCss}
`;

// Muted so the excerpt supports the title rather than competing with it.
export const SeriesCardExcerpt = styled.div`
  color: var(--color-fg-muted);
  font-weight: 500;
  font-size: 1.125rem;
`;

// Its own layer so body spacing stays independent of the header.
export const SeriesCardBody = styled.div`
  margin-block-start: 0.75rem;
`;

// Clamped to two lines so cards keep even heights.
export const SeriesCardDescription = styled.div`
  ${clampedDescriptionCss}
`;

// Reflows like the post card footer so series and post cards read consistently.
export const SeriesCardFooter = styled.footer`
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  justify-content: start;
  align-items: center;
  row-gap: 0.5rem;
  margin-block-start: 0.75rem;

  .page-categories {
    position: relative;
    z-index: 1;
  }

  ${dotSeparatorCss}

  // Dividers only make sense in the single-line desktop layout above — items
  // reflow onto multiple rows below this point, so a trailing dot would end
  // up with no adjacent item to separate.
  @media ${BREAKPOINTS.tabletAndSmaller} {
    display: grid;
    grid-auto-flow: initial;
    grid-template-columns: repeat(2, 1fr);

    > *:nth-child(even) {
      justify-self: end;
    }

    > *:not(:last-child)::after {
      display: none;
    }
  }

  @media ${BREAKPOINTS.smMobileAndSmaller} {
    grid-template-columns: 1fr;

    > *,
    > *:nth-child(even) {
      justify-self: start;
    }
  }
`;
