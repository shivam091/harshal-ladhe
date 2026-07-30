import { styled } from "@linaria/react";

/*
  Sticky nav panel — fades in and slides in after hydration via --x and opacity
  inline styles. Scrolls internally (rather than the whole PostTOC sidebar)
  when the heading list is taller than the space PostTOC's max-block-size
  leaves available, since LikeButton — a sibling of this component in the post
  layout, not a child here — needs its own space below it, unaffected by this
  list's scroll position.
*/
export const TocWrapper = styled.nav`
  flex: 1 1 auto;
  min-block-size: 0;
  overflow-block: auto;
  transition:
    opacity var(--motion-duration-medium),
    transform var(--motion-duration-slow) cubic-bezier(0.17, 0.67, 0.54, 1);
  transform: translateX(var(--x, 20px));
`;

/*
  "Table of Contents" label above the links. Hidden below the PostTOC collapse
  breakpoint, where the heading list gives way to LikeButton's floating mode.
*/
export const TocTitle = styled.h2`
  font-size: var(--font-size-base);
  margin-block-end: var(--space-base);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 2px;

  @media (width <= 64rem) {
    display: none;
  }
`;

// List of heading links — plain <ul>/<li> so AT can announce "list, N items" instead of a flat run of links.
export const TocList = styled.ul`
  list-style: none;
  margin: var(--space-none);
  padding: var(--space-none);

  @media (width <= 64rem) {
    display: none;
  }
`;

/*
  Individual ToC link — depth indent, active color, and font-size
  are applied via getStylesForDepth inline styles, not selectors here.
*/
export const ContentLinkHeading = styled.a`
  display: block;
  color: var(--color-fg-muted);
  transition: color var(--motion-duration-slow);
  font-size: calc(var(--font-size-px, 16) / 16 * 1rem);
  line-height: var(--line-height-code);

  &:hover {
    text-decoration: none;
  }

  &:hover,
  &:focus {
    color: var(--color-fg-default);
    transition: color 0ms;
  }
`;
