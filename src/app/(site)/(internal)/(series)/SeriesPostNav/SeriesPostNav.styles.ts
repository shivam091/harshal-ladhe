import { styled } from "@linaria/react";

// Dotted callout box announcing the post's place in its series. Port of the
// Jekyll series/post-nav.html include (.series-nav).
export const SeriesNav = styled.nav`
  font-size: 0.9375em;
  margin-block-start: clamp(1rem, 1.25vw, 1.5rem);
  padding: clamp(0.5rem, 0.8vw, 0.75rem);
  border: 1px dotted var(--color-border-muted);
  border-radius: 0.1875rem;
`;

// "This post is Part X of Y in the … series." line.
export const SeriesNavHeader = styled.header`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-block-end: 1rem;
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
  font-weight: 500;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`;

// Previous / next part links row — spread to opposite ends, wrapping on small screens.
export const SeriesNavLinks = styled.ul`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// A single previous/next entry inside SeriesNavLinks — icon plus link, inline.
export const SeriesNavItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-block-end: 0;
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
