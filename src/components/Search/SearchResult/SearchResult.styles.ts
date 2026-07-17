import { styled } from "@linaria/react";
import Link from "next/link";

/*
  A negative margin lets the hover background bleed past the content without shifting the
  list's rhythm. Row spacing comes from the list's flex gap, since flex items don't
  margin-collapse and a per-row margin would double up. <p> margins are reset per element
  because the global reset skips <p>.
*/
export const Wrapper = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  margin-inline: calc(0.75rem * -1);
  border-radius: 0.375rem;
  transition: opacity 300ms, background-color 150ms;

  &:hover,
  &:focus-within {
    @media (hover: hover) {
      background-color: var(--color-bg-control-transparent-hover);
    }
  }

  &:not(:last-child) {
    --border-width: calc((0.0625rem + 0.125rem) / 2);

    &::after {
      content: "";
      position: absolute;
      inset-inline: 0;
      inset-block-end: calc(-1 * var(--row-gap) / 2 - 0.0625rem / 2);
      border-block-end: 0.0625rem dotted var(--color-border-muted);
      margin-inline: auto;
    }
  }

  /*
    Matches are painted with the Custom Highlight API rather than <mark>, so only colour and
    decoration apply: padding, outline and border-radius can't be used here. Only near-exact hits
    register for title and excerpt, so fuzzy matches stay visually plain.
  */
  &::highlight(search-hit) {
    background-color: hsl(from var(--color-fg-attention) h s l / 0.25);
    color: inherit;
  }
`;

// Category eyebrow above the title — no gap to the title below it.
export const Category = styled.span`
  display: block;
  margin: 0;
  color: var(--color-fg-accent);
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Link wrapping the entire row's content (category, title, excerpt) so the whole result is clickable.
export const ResultLink = styled(Link)`
  position: relative;
  display: block;
  text-decoration: none;
  color: var(--color-fg-default);
`;

// The type icon is sized in em so it scales with the title text.
export const Title = styled.p`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-block-start: 0;
  margin-block-end: 0.325rem;
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 1.75rem;

  svg {
    flex-shrink: 0;
    inline-size: 0.875em;
    block-size: 0.875em;
    color: var(--color-fg-muted);
  }
`;

/*
  Clamped to 3 lines so long descriptions don't dominate, and muted so the title stays the
  focal point of each row.
*/
export const Excerpt = styled.p`
  position: relative;
  margin: 0;
  color: var(--color-fg-muted);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  hyphens: auto;
  overflow-wrap: break-word;
`;

/*
  Body hits are literal matches, so their words always read as highlighted, through their own
  highlight rather than the row's near-exact one.
*/
export const BodySnippet = styled.p`
  margin-block: 0.375rem 0;
  padding-inline-start: 0.625rem;
  border-inline-start: 0.125rem solid var(--color-border-default);
  color: var(--color-fg-muted);
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  overflow-wrap: break-word;

  &::highlight(search-body-hit) {
    background-color: hsl(from var(--color-fg-attention) h s l / 0.25);
    color: var(--color-fg-default);
  }
`;
