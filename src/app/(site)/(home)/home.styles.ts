import { styled } from "@linaria/react";

/*
  Home page section grid — port of the Jekyll home layout's `.content-grid`.

  Pinned and featured posts span the full width, trending tags and popular
  categories sit side-by-side, and recently-updated spans full width again.
  Sections are addressed by class so a hidden (disabled/empty) section simply
  collapses its named row. Below the md breakpoint everything stacks.
*/
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    "pinned-posts pinned-posts"
    "featured-posts featured-posts"
    "trending-tags popular-categories"
    "recently-updated recently-updated";
  gap: clamp(0.5rem, 0.8vw, 0.75rem) clamp(1rem, 1.25vw, 1.5rem);
  align-items: start;
  box-sizing: border-box;

  .pinned-posts {
    grid-area: pinned-posts;
  }

  .featured-posts {
    grid-area: featured-posts;
  }

  .trending-tags {
    grid-area: trending-tags;
  }

  .popular-categories {
    grid-area: popular-categories;
  }

  .recently-updated {
    grid-area: recently-updated;
  }

  @media (width <= 48rem) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "pinned-posts"
      "featured-posts"
      "trending-tags"
      "popular-categories"
      "recently-updated";
  }
`;

// A single home section wrapper. grid-area comes from the class applied by the page.
export const HomeSection = styled.section`
  min-inline-size: 0;
`;

// Section heading — "Pinned Posts", "Trending Tags", etc.
export const SectionHeading = styled.h2`
  color: var(--color-fg-heading);
  font-size: 1.5rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
`;
