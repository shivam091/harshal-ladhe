import { styled } from "@linaria/react";
import {
  hoverShadowLiftCss,
  stretchedCardLinkCss,
  clampedDescriptionCss,
} from "@/components/common.styles";

// Series page section wrapper — intro paragraph sits above the card feed.
export const SeriesSection = styled.section`
  p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    line-height: 1.625;
    margin-block-end: clamp(1rem, 1.25vw, 1.5rem);
  }
`;

// Vertical feed of series cards.
export const SeriesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 1.25vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
`;

/*
  A single series card. position:relative anchors the title link's stretched
  ::after overlay so a click anywhere on the card opens the series.
*/
export const SeriesCard = styled.li`
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

/*
  Series title link — accent colour, no underline; the ::after stretches
  invisibly over the whole card so a click anywhere navigates to the series.
*/
export const SeriesCardTitle = styled.h2`
  font-size: 1.25rem;
  margin-block-start: 0;

  ${stretchedCardLinkCss}
`;

// Short lead text under the title — muted, medium weight.
export const SeriesCardExcerpt = styled.div`
  color: var(--color-fg-muted);
  font-weight: 500;
  font-size: 1.125rem;
`;

// Card body — description with a 2-line clamp.
export const SeriesCardBody = styled.div`
  margin-block-start: 0.75rem;
`;

export const SeriesCardDescription = styled.div`
  ${clampedDescriptionCss}
`;

// Card footer — part count.
export const SeriesCardFooter = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 0.5rem;
  margin-block-start: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-fg-muted);
`;
