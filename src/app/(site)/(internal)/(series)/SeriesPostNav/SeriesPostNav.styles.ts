import { styled } from "@linaria/react";

// Dotted callout box announcing the post's place in its series. Port of the
// Jekyll series/post-nav.html include (.series-nav).
export const SeriesNav = styled.nav`
  font-size: 0.9375em;
  margin-block-start: var(--fluid-space-base);
  padding: var(--fluid-space-sm);
  border: 1px dotted var(--color-border-muted);
  border-radius: var(--border-radius-sm);
`;

// "This post is Part X of Y in the … series." line.
export const SeriesNavHeader = styled.header`
  display: flex;
  align-items: baseline;
  gap: var(--space-xs);
  margin-block-end: var(--space-base);
  color: var(--color-fg-muted);
`;

// Decorative leading emoji (📚) — aria-hidden.
export const SeriesNavIcon = styled.span`
  flex-shrink: 0;
`;

// Wraps the "Part X of Y in the … series" sentence inside SeriesNavHeader.
export const SeriesNavPosition = styled.span``;

// The series title link inside the header sentence.
export const SeriesNavTitleLink = styled.a`
  color: var(--color-fg-accent);
  text-decoration: none;
  font-weight: var(--font-weight-medium);

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

// Previous / next part links row — spread to opposite ends, wrapping on small screens.
export const SeriesNavLinks = styled.ul`
  display: flex;
  gap: var(--space-base);
  flex-wrap: wrap;
  justify-content: space-between;
  margin: var(--space-none);
  padding: var(--space-none);
  list-style: none;
`;

// A single previous/next entry inside SeriesNavLinks — icon plus link, inline.
export const SeriesNavItem = styled.li`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-block-end: var(--space-none);
`;

// Decorative directional emoji (⬅️ / ➡️) — aria-hidden.
export const SeriesNavItemIcon = styled.span`
  flex-shrink: 0;
`;

// Static "Part N:" label preceding each prev/next link — plain text outside the anchor, so hovering it shows no link affordance.
export const SeriesNavPartLabel = styled.strong`
  flex-shrink: 0;
  color: var(--color-fg-default);
`;

// Previous/next part link — only the post title, in accent color.
export const SeriesNavLink = styled.a`
  color: var(--color-fg-accent);
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;
