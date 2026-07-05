import { styled } from "@linaria/react";

// Shared base — variant wrappers extend this and set --aside-accent / --aside-bg.
export const BaseWrapper = styled.aside`
  --aside-border-width: 3px;
  position: relative;
  margin-block: 2rem;
  padding-block: 1.5rem;
  padding-inline: 2rem;
  padding-inline-start: calc(2rem - var(--aside-border-width));
  border-inline-start: var(--aside-border-width) solid var(--color-border-transparent);
  border-radius: 0.1875rem 0.375rem 0.375rem 0.1875rem;
  font-size: 1rem;
  background-color: var(--aside-bg);
  transition:
    background-color 350ms cubic-bezier(0.41, 0.1, 0.13, 1),
    border-color 350ms cubic-bezier(0.41, 0.1, 0.13, 1);

  & + & {
    margin-block-start: calc(2rem * -0.5);
  }

  /*
    Desktop: push the aside right so the absolutely-positioned icon
    (translated ~25px left of the aside edge) stays inside PostContent's
    overflow-inline: hidden boundary.
  */
  @media (width > 48rem) {
    margin-inline-start: 1rem;
  }

  /*
    Mobile: icon and SVG edge are hidden; use the border-inline-start
    as the accent line instead of an absolutely-positioned element that
    would bleed outside the overflow boundary.
  */
  @media (width <= 48rem) {
    border-inline-start-color: var(--aside-accent);
  }
`;

// Icon centered on the top-left corner of the aside — hidden on narrow viewports.
export const IconWrapper = styled.div`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  transform: translate(calc(-50% - 4px), -50%);
  color: var(--aside-accent);

  @media (width <= 48rem) {
    display: none;
  }

  svg {
    display: block;
  }
`;

// Bold title line — deep-link anchor target, offset below the sticky header when scrolled to.
export const Title = styled.strong`
  display: block;
  font-size: 1.125rem;
  margin-block-end: 0.25rem;
  font-weight: 600;
  scroll-margin-block-start: calc(5rem + 2rem);
`;

// Aside body — trims the last child's block-end margin so padding stays symmetric.
export const Content = styled.div`
  display: grid;

  & > *:first-child {
    margin-block-start: 0;
  }

  & > *:last-child {
    margin-block-end: 0;
  }
`;

// SVG + filler column — hidden on narrow viewports.
export const LeftEdgeDesktop = styled.div`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inset-block-end: 0;
  block-size: 100%;
  display: flex;
  flex-direction: column;
  transform: translateX(-3px);

  @media (width <= 48rem) {
    display: none;
  }
`;

// Extends the top-edge SVG downward to the bottom of the aside.
export const LeftEdgeFiller = styled.div`
  flex: 1;
  inline-size: 3px;
  background-color: var(--aside-accent);
  border-radius: 0 0 624.9375rem 624.9375rem;
  margin-block-start: -1px;
  transition: background-color 350ms cubic-bezier(0.41, 0.1, 0.13, 1);
`;
