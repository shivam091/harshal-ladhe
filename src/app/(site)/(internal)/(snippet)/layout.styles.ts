import { styled } from "@linaria/react";

// Root article wrapper for a single snippet page.
export const Article = styled.article``;

// Header block — excerpt lead under the title.
export const SnippetHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-block-end: var(--space-lg);
`;

// Lead/excerpt line under the title.
export const SnippetExcerpt = styled.div`
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-fg-accent-muted);
  font-weight: var(--font-weight-medium);
`;

// Rendered MDX body. Section-style underlines on top-level headings match the reference snippet.scss.
export const SnippetContent = styled.div`
  h1,
  h2 {
    border-block-end: var(--border-width-default) solid var(--color-border-default);
    padding-block-end: var(--space-xs);
  }
`;
