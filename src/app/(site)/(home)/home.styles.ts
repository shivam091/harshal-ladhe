import { styled } from "@linaria/react";

// Sections are placed by class name so a hidden (disabled or empty) section simply collapses its row.
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

// Placement comes from its class so the grid can collapse hidden sections.
export const HomeSection = styled.section`
  min-inline-size: 0;
`;

// Section heading — "Pinned Posts", "Trending Tags", etc.
export const SectionHeading = styled.h2`
  color: var(--color-fg-heading);
  font-size: 1.5rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
`;
