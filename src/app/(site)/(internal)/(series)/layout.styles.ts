import { styled } from "@linaria/react";

// Root article wrapper for a single series page.
export const Article = styled.article``;

// Header block — excerpt lead under the title.
export const SeriesHeader = styled.header`
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
  Rendered MDX intro body. Section-style underlines on top-level headings match
  the post/snippet content treatment; scoped to direct children so the nested
  post-card titles in the parts list below aren't underlined.
*/
export const SeriesContent = styled.div`
  line-height: var(--line-height-paragraph);

  & > h1,
  & > h2 {
    border-block-end: var(--border-width-default) solid var(--color-border-default);
    padding-block-end: var(--space-xs);
  }
`;

// "Posts" section heading above the list of parts in the series.
export const PostsHeading = styled.h2`
  color: var(--color-fg-heading);
  margin-block: var(--fluid-space-lg);
  padding-block-end: var(--space-xs);
  border-block-end: var(--border-width-default) solid var(--color-border-default);
`;
