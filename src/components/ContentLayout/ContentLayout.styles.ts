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

/*
  Mirrors the post grid's breakpoints so every content type reads alike. Collapses to one column
  when the body has no linkable headings, so such entries aren't left beside an empty sidebar;
  checked against the server-rendered headings rather than the TOC, which only fills in after
  hydration and would shift the layout.
*/
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 80ch) 1fr;
  grid-template-areas: "content toc";
  column-gap: 2rem;

  @media (width <= 80rem) {
    grid-template-columns: minmax(0, 70ch) 1fr;
    column-gap: 0.75rem;
  }

  @media (width <= 64rem) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "toc"
      "content";
  }

  &:not(:has(#post-content :is(h2, h3)[id])) {
    grid-template-columns: 1fr;
    grid-template-areas: "content";

    > aside {
      display: none;
    }
  }
`;

/*
  Underlined top-level headings split long MDX bodies into visually distinct sections.
  min-inline-size: 0 lets wide code scroll inside the column instead of stretching the grid.
*/
export const ContentBody = styled.div`
  grid-area: content;
  min-inline-size: 0;

  h1,
  h2 {
    border-block-end: 0.0625rem solid var(--color-border-default);
    padding-block-end: 0.25rem;
  }
`;

// A flex column so the TOC's own list does the scrolling, matching the post sidebar.
export const ContentTOC = styled.aside`
  grid-area: toc;
  display: flex;
  flex-direction: column;
  position: sticky;
  inset-block-start: calc(5rem + 1.5rem);
  max-block-size: calc(100vh - 5rem - 1.5rem);
  padding-inline: 0.5rem;
  align-self: start;

  @media (width <= 64rem) {
    position: static;
    max-block-size: none;
    padding-inline: 0;
  }
`;
