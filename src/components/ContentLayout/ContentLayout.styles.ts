import { styled } from "@linaria/react";
import Link from "next/link";

// An <article> so the page reads as standalone content to assistive tech and readers.
export const Article = styled.article``;

// Groups the excerpt and CTA so they share one spacing rhythm under the title.
export const ContentHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-block-end: 1.5rem;
`;

// Larger accent lead so the excerpt reads as a summary, distinct from body text.
export const ContentExcerpt = styled.div`
  font-size: 1.25rem;
  line-height: 1.625;
  color: var(--color-fg-accent-muted);
  font-weight: 500;
`;

// Self-aligned to the start so the header's column flex doesn't stretch the link full width.
export const ContentCtaLink = styled(Link)`
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

// Underlined top-level headings split long MDX bodies into visually distinct sections.
export const ContentBody = styled.div`
  h1,
  h2 {
    border-block-end: 0.0625rem solid var(--color-border-default);
    padding-block-end: 0.25rem;
  }
`;
