import { styled } from "@linaria/react";

// Shared base — variant wrappers extend this and set --aside-accent / --aside-bg.
export const BaseWrapper = styled.aside`
  --aside-border-width: 3px;
  position: relative;
  margin-block: var(--space-xl);
  padding-block: var(--space-lg);
  padding-inline: var(--space-xl);
  padding-inline-start: calc(var(--space-xl) - var(--aside-border-width));
  border-inline-start: var(--aside-border-width) solid var(--color-border-transparent);
  border-radius: var(--border-radius-sm) var(--border-radius-md) var(--border-radius-md) var(--border-radius-sm);
  font-size: var(--font-size-base);
  background-color: var(--aside-bg);
  transition:
    background-color var(--color-swap-duration) var(--color-swap-timing-function),
    border-color var(--color-swap-duration) var(--color-swap-timing-function);

  & + & {
    margin-block-start: calc(var(--space-xl) * -0.5);
  }

  /*
    Desktop: push the aside right so the absolutely-positioned icon
    (translated ~25px left of the aside edge) stays inside PostContent's
    overflow-inline: hidden boundary.
  */
  @media (width > 48rem) {
    margin-inline-start: var(--space-base);
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
  font-size: var(--font-size-md);
  margin-block-end: var(--space-xs);
  font-weight: var(--font-weight-semi-bold);
  scroll-margin-block-start: calc(var(--header-height) + var(--space-xl));
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
  border-radius: 0 0 var(--border-radius-full) var(--border-radius-full);
  margin-block-start: -1px;
  transition: background-color var(--color-swap-duration) var(--color-swap-timing-function);
`;
