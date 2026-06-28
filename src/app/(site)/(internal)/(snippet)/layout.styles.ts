import { styled } from "@linaria/react";
import Link from "next/link";

// Root article wrapper for a single snippet page.
export const Article = styled.article``;

// Header block — excerpt lead under the title.
export const SnippetHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-block-end: 1.5rem;
`;

// Lead/excerpt line under the title.
export const SnippetExcerpt = styled.div`
  font-size: 1.25rem;
  line-height: 1.625;
  color: var(--color-fg-accent-muted);
  font-weight: 500;
`;

// Optional CTA under the excerpt, e.g. "Read post" — only rendered when the registry entry sets `link`.
export const SnippetLink = styled(Link)`
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-fg-accent);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// Rendered MDX body. Section-style underlines on top-level headings match the reference snippet.scss.
export const SnippetContent = styled.div`
  h1,
  h2 {
    border-block-end: 0.0625rem solid var(--color-border-default);
    padding-block-end: 0.25rem;
  }
`;
