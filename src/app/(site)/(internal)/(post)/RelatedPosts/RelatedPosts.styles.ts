import { styled } from "@linaria/react";

// Section wrapper for the related-posts block at the foot of a post.
export const RelatedPostsSection = styled.section`
  margin-block-start: var(--fluid-space-xl);
`;

// Section heading — "Related Posts".
export const RelatedPostsHeading = styled.h2`
  font-size: var(--font-size-xl);
  margin-block: var(--space-none) var(--fluid-space-md);
`;

// Responsive 3-up grid, collapsing to a single column below the md breakpoint.
export const RelatedPostsGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--fluid-space-md);
  margin: var(--space-none);
  padding: var(--space-none);
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
  border: var(--border-width-default) solid var(--color-border-default);
  border-radius: var(--border-radius-default);
  padding: var(--fluid-space-base);
  margin-block-end: var(--space-none);
  box-shadow: var(--box-shadow-sm);
  transition: box-shadow var(--motion-duration-medium) var(--motion-easing-out);

  // Lifts to the accent border + a deeper shadow on hover, matching the post/series card treatment.
  &:hover {
    @media (hover: hover) {
      box-shadow: var(--box-shadow-md);
    }
  }

  // Keyboard-focus ring around the whole card when the title link inside is focused.
  &:focus-within {
    outline: var(--outline-focus-width) solid var(--color-outline-focus);
    outline-offset: var(--outline-focus-offset);
  }
`;

// Card header — title and optional excerpt.
export const RelatedPostHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-block-end: var(--space-sm);
`;

// Card title link — accent colour, no underline, stretched overlay for whole-card click.
export const RelatedPostTitle = styled.h3`
  font-size: var(--font-size-lg);
  margin-block: var(--space-none);

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

// Short lead line under the title — muted, medium weight.
export const RelatedPostExcerpt = styled.div`
  color: var(--color-fg-muted);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
`;

// Card body — description with a 2-line clamp to keep card heights even.
export const RelatedPostBody = styled.div``;

export const RelatedPostDescription = styled.div`
  color: var(--color-fg-muted);
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

// Card footer — published-date meta row, pushed to the bottom of the card.
export const RelatedPostFooter = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm) var(--space-base);
  margin-block-start: auto;
  padding-block-start: var(--space-base);
`;
