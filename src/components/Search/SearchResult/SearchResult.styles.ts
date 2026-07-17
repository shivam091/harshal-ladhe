import { styled } from "@linaria/react";
import Link from "next/link";

/*
  Single result row.

  Padding-inline + a matching negative margin-inline give the row breathing room for the
  hover/focus background without shifting the list's horizontal rhythm — the row visibly
  bleeds slightly wider than its content, matching the full clickable area (category, title,
  and excerpt are all inside ResultLink, so the whole row is one hit target).

  Row-to-row spacing is NOT a margin here — it's the parent SearchResults Wrapper's own flex
  `gap` (--row-gap, inherited down since custom properties cascade), because flex items don't
  margin-collapse the way block siblings do: a per-row margin would count twice between two
  rows (each contributing its own, uncancelled) instead of once. The divider below centers
  itself in that inherited --row-gap directly — the padding above/below it cancels out of the
  centering math entirely (it's added equally on both sides of the gap), so the offset only
  ever needs to know the gap itself, not this row's own padding.

  This project's global reset explicitly excludes <p> from its margin/padding zeroing (see
  body *:not(p)... in _global.scss), so Title/Excerpt — both <p>s — carry the browser's
  default UA margin unless every side is reset explicitly. Category/Title/Excerpt below all
  do this themselves rather than relying on a blanket `p { margin: 0 }` here, which would also
  flatten Title's own intentional margin-block-end (a class selector loses to a
  class+descendant selector, regardless of source order).
*/
export const Wrapper = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: var(--space-md);
  margin-inline: calc(var(--space-md) * -1);
  border-radius: var(--border-radius-md);
  transition: opacity var(--motion-duration-medium), background-color var(--motion-duration-fast);

  &:hover,
  &:focus-within {
    @media (hover: hover) {
      background-color: var(--color-bg-control-transparent-hover);
    }
  }

  &:not(:last-child) {
    --border-width: calc((var(--border-width-thin) + var(--border-width-medium)) / 2);

    &::after {
      content: "";
      position: absolute;
      inset-inline: var(--space-none);
      inset-block-end: calc(-1 * var(--row-gap) / 2 - var(--border-width-default) / 2);
      border-block-end: var(--border-width-default) dotted var(--color-border-muted);
      margin-inline: auto;
    }
  }

  mark {
    all: unset;
  }

  /*
    Matched ranges (title or excerpt) render as <mark>, but only near-exact hits (isExactMatch,
    reflected here rather than off Fuse's own blended score — see useSearchIndex) get this badge
    treatment; fuzzy/typo'd matches still mark the ranges in the DOM for clarity but stay
    visually plain, same distinction the reference implementation draws off Algolia's nbTypos.
    Highlight uses the "attention" token family (closest existing warm/amber tokens) in place of
    reference's literal gold hsl(50deg). Scoped here (not per-field) so it covers every marked
    field — title and excerpt alike — from one place.
  */
  &[data-highlighted="true"] mark {
    background-color: hsl(from var(--color-fg-attention) h s l / 0.2);
    outline: var(--border-width-thin) solid hsl(from var(--color-fg-attention) h s l / 0.4);
    color: inherit;
    border-radius: var(--border-radius-sm);
    padding-inline: 0.15em;
    margin-inline: -0.15em;
  }
`;

// Category eyebrow above the title — no gap to the title below it.
export const Category = styled.span`
  display: block;
  margin: 0;
  color: var(--color-fg-accent);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
`;

// Link wrapping the entire row's content (category, title, excerpt) so the whole result is clickable.
export const ResultLink = styled(Link)`
  position: relative;
  display: block;
  text-decoration: none;
  color: var(--color-fg-default);
`;

// Result title — see Wrapper's &[data-highlighted="true"] mark rule for the match-highlight styling.
export const Title = styled.p`
  display: block;
  margin-block-start: 0;
  margin-block-end: 0.325rem;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-md);
  line-height: 1.75rem;
`;

/*
  Trimmed lead text under the title, clamped to 3 lines so long descriptions don't dominate
  the list. Muted (unlike the reference implementation, which leaves it full-strength) so the
  title reads as the clear focal point of each row — a small, deliberate hierarchy deviation.
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
