import { styled } from "@linaria/react";

/*
  Scrolls internally rather than scrolling the whole sidebar, so content sitting below
  the list keeps its place whatever the list's scroll position.
*/
export const TocWrapper = styled.nav`
  flex: 1 1 auto;
  min-block-size: 0;
  overflow-block: auto;
  transition:
    opacity 300ms,
    transform 500ms cubic-bezier(0.17, 0.67, 0.54, 1);
  transform: translateX(var(--x));
`;

// Hidden once the sidebar collapses, since the heading list it labels gives way there.
export const TocTitle = styled.h2`
  font-size: 1rem;
  margin-block-end: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;

  @media (width <= 64rem) {
    display: none;
  }
`;

// List of heading links — plain <ul>/<li> so AT can announce "list, N items" instead of a flat run of links.
export const TocList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  @media (width <= 64rem) {
    display: none;
  }
`;

// Depth- and active-dependent styles are inline, so only the shared base lives here.
export const ContentLinkHeading = styled.a`
  display: block;
  color: var(--color-fg-muted);
  transition: color 500ms;
  font-size: calc(var(--font-size-px) / 16 * 1rem);
  line-height: 1.6;

  &:hover {
    text-decoration: none;
  }

  &:hover,
  &:focus {
    color: var(--color-fg-default);
    transition: color 0ms;
  }
`;
