import { styled } from "@linaria/react";

// Root article wrapper for a single series page.
export const Article = styled.article``;

// Header block — excerpt lead under the title.
export const SeriesHeader = styled.header`
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

/*
  Underlined top-level headings split the intro into sections like other content; scoped to
  direct children so card titles in the parts list aren't underlined.
*/
export const SeriesContent = styled.div`
  line-height: 1.75;

  & > h1,
  & > h2 {
    border-block-end: 0.0625rem solid var(--color-border-default);
    padding-block-end: 0.25rem;
  }
`;

// "Posts" section heading above the list of parts in the series.
export const PostsHeading = styled.h2`
  color: var(--color-fg-heading);
  margin-block: clamp(1.5rem, 2vw, 2rem);
  padding-block-end: 0.25rem;
  border-block-end: 0.0625rem solid var(--color-border-default);
`;

// Same top spacing as the content footer on posts, so the share row sits at the same distance everywhere.
export const SeriesShare = styled.div`
  margin-block-start: clamp(1.5rem, 2vw, 2rem);
  font-size: 0.875rem;
  color: var(--color-fg-muted);
`;
