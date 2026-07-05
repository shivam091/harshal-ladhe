import { styled } from "@linaria/react";
import {
  focusRingCss,
  stretchedCardLinkCss,
  clampedDescriptionCss,
} from "@/components/common.styles";

// Section wrapper for the related-posts block at the foot of a post.
export const RelatedPostsSection = styled.section`
  margin-block-start: clamp(2rem, 3vw, 3rem);
`;

// Section heading — "Related Posts".
export const RelatedPostsHeading = styled.h2`
  font-size: 1.5rem;
  margin-block: 0 clamp(0.75rem, 1vw, 1rem);
`;

// Responsive 3-up grid, collapsing to a single column below the md breakpoint.
export const RelatedPostsGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(0.75rem, 1vw, 1rem);
  margin: 0;
  padding: 0;
  list-style: none;

  @media (width <= 48rem) {
    grid-template-columns: 1fr;
  }
`;

/*
  Single related-post card. position:relative anchors the title link's
  stretched ::after overlay so a click anywhere on the card navigates.
*/
export const RelatedPost = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  padding: clamp(1rem, 1.25vw, 1.5rem);
  margin-block-end: 0;
  box-shadow: var(--box-shadow-sm);
  transition: box-shadow 300ms cubic-bezier(0.3, 0.8, 0.6, 1);

  // Lifts to the accent border + a deeper shadow on hover, matching the post/series card treatment.
  &:hover {
    @media (hover: hover) {
      box-shadow: var(--box-shadow-md);
    }
  }

  // Keyboard-focus ring around the whole card when the title link inside is focused.
  &:focus-within {
    ${focusRingCss}
  }
`;

// Card header — title and optional excerpt.
export const RelatedPostHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-block-end: 0.5rem;
`;

// Card title link — accent colour, no underline, stretched overlay for whole-card click.
export const RelatedPostTitle = styled.h3`
  font-size: 1.25rem;
  margin-block: 0;

  ${stretchedCardLinkCss}
`;

// Short lead line under the title — muted, medium weight.
export const RelatedPostExcerpt = styled.div`
  color: var(--color-fg-muted);
  font-weight: 500;
  font-size: 1rem;
`;

// Card body — description with a 2-line clamp to keep card heights even.
export const RelatedPostBody = styled.div``;

export const RelatedPostDescription = styled.div`
  ${clampedDescriptionCss}
`;

// Card footer — published-date meta row, pushed to the bottom of the card.
export const RelatedPostFooter = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  margin-block-start: auto;
  padding-block-start: 1rem;
`;
