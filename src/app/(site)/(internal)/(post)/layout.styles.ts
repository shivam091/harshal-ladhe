import { styled } from "@linaria/react";

// Root article wrapper for a single post page.
export const Article = styled.article``;

// Groups the excerpt and meta row so they share one spacing rhythm under the title.
export const PostHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 0.8vw, 0.75rem);
  margin-block-end: 1.5rem;
`;

// Lead/excerpt line under the title.
export const PageExcerpt = styled.div`
  font-size: 1.25rem;
  line-height: 1.625;
  color: var(--color-fg-accent-muted);
  font-weight: 500;
`;

// Single column when a post has no TOC, so prose isn't left beside an empty sidebar.
export const PostGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 80ch) 1fr;
  grid-template-areas: "post-content toc";
  column-gap: 2rem;
  margin-block-start: 1rem;

  @media (width <= 80rem) {
    grid-template-columns: minmax(0, 70ch) 1fr;
    column-gap: 0.75rem;
  }

  @media (width <= 64rem) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "toc"
      "post-content";
  }

  &:not(:has(aside)) {
    grid-template-columns: 1fr;
    grid-template-areas: "post-content";
  }
`;

// min-inline-size: 0 lets wide content scroll inside the column instead of stretching the grid.
export const PostContent = styled.div`
  grid-area: post-content;
  overflow-inline: hidden;
  min-inline-size: 0;
  container-type: inline-size;
  user-select: none;

  h2 {
    border-block-end: 0.0625rem solid var(--color-border-default);
    padding-block-end: 0.25rem;
  }
`;

// Sticky so the table of contents stays in reach while reading; collapses where there's no room.
export const PostTOC = styled.aside`
  grid-area: toc;
  position: sticky;
  inset-block-start: calc(5rem + 1.5rem);
  max-block-size: calc(100vh - 5rem - 1.5rem);
  padding-inline: 0.5rem;
  align-self: start;
  overflow-block: auto;

  @media (width <= 64rem) {
    display: none;
  }
`;

export const PostFooter = styled.footer``;
