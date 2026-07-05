import { styled } from "@linaria/react";

// Sticky nav panel — fades in and slides in after hydration via --x and opacity inline styles.
export const TocWrapper = styled.nav`
  transition:
    opacity var(--motion-duration-medium),
    transform var(--motion-duration-slow) cubic-bezier(0.17, 0.67, 0.54, 1);
  transform: translateX(var(--x, 20px));
`;

// "Table of Contents" label above the links.
export const TocTitle = styled.h2`
  font-size: var(--font-size-base);
  margin-block-end: var(--space-base);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 2px;
`;

// List of heading links — plain <ul>/<li> so AT can announce "list, N items" instead of a flat run of links.
export const TocList = styled.ul`
  list-style: none;
  margin: var(--space-none);
  padding: var(--space-none);
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
