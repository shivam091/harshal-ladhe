import { styled } from "@linaria/react";

// Root article wrapper for a single post page.
export const Article = styled.article``;

// Header block — excerpt lead and primary meta row (injected at top of PostContent via remark).
export const PostHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--fluid-space-sm);
  margin-block-end: var(--space-lg);
`;

// Lead/excerpt line under the title.
export const PageExcerpt = styled.div`
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-fg-accent-muted);
  font-weight: var(--font-weight-medium);
`;

/*
  Two-column grid: prose content left, TOC right.
  Falls back to single column when there is no .toc-wrapper child (same logic as post.scss).
*/
export const PostGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 80ch) 1fr;
  grid-template-areas: "post-content toc";
  column-gap: var(--space-xl);
  margin-block-start: var(--space-base);

  @media (width <= 80rem) {
    grid-template-columns: minmax(0, 70ch) 1fr;
    column-gap: var(--space-md);
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

// MDX body — prose lives here with PostMeta at the very top (injected by remark-post-meta).
export const PostContent = styled.div`
  grid-area: post-content;
  overflow-inline: hidden;
  min-inline-size: 0;
  container-type: inline-size;
  user-select: none;

  h2 {
    border-block-end: var(--border-width-default) solid var(--color-border-default);
    padding-block-end: var(--space-xs);
  }
`;

// Sticky sidebar slot for the table of contents; collapses on small screens.
export const PostTOC = styled.aside`
  grid-area: toc;
  position: sticky;
  inset-block-start: calc(var(--header-height) + var(--space-lg));
  max-block-size: calc(100vh - var(--header-height) - var(--space-lg));
  padding-inline: var(--space-sm);
  align-self: start;
  overflow-block: auto;

  @media (width <= 64rem) {
    display: none;
  }
`;

export const PostFooter = styled.footer``;
