import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import Link from "next/link";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Sticky glass-effect header bar; applies a scroll-driven glass-on animation and collapses to flex-wrap on mobile.
export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  position: sticky;
  inset-block-start: var(--header-top-offset, 0px);
  inset-inline: 0;
  z-index: 1001;
  block-size: var(--header-height);
  padding: var(--fluid-space-md);
  color: var(--color-fg-accent-muted);
  gap: var(--space-md);

  @media ${BREAKPOINTS.mobile} {
    gap: var(--space-sm);
    justify-content: space-between;
    min-block-size: var(--header-height);
    block-size: auto;
  }

  background: hsl(from var(--color-bg-sky-from) h s l / var(--glass-opacity));
  backdrop-filter: blur(var(--blur-amount));
  transition: color var(--color-swap-duration) var(--color-swap-timing-function);
  will-change: color, backdrop-filter;

  @supports (animation-timeline: scroll()) {
    /*
      linear timing lets the @keyframes stops define the curve directly,
      so the 3-stop easing in glass-on maps 1:1 to scroll position.
      --scroll-threshold is set per banner type via :has() in _global.scss.
    */
    animation: glass-on linear;
    animation-timeline: scroll(root block);
    animation-range: 0px var(--scroll-threshold);
    animation-fill-mode: forwards;
  }

  // Animates the header glassmorphism effect by transitioning the typed --glass-opacity/--blur-amount properties (registered in _properties.scss).
  @keyframes glass-on {
    from {
      --glass-opacity: 0;
      --blur-amount: 0px;
    }
    50% {
      --glass-opacity: 0.35;
      --blur-amount: 2px;
    }
    to {
      --glass-opacity: 0.7;
      --blur-amount: 4px;
    }
  }
`;

// Next.js Link wrapping the site logo and name; inherits header color and suppresses underline.
export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-md);
  line-height: calc(1.75 / 1.125);
  color: inherit;
  text-decoration-line: none;

  &:hover {
    @media (hover: hover) {
      color: var(--color-fg-default);
      text-decoration-line: none;
    }
  }
`;

/*
  Fixed 3 rem × 3 rem class applied directly to next/image to avoid styled(Image)
  which triggers `Image.__wyw_meta` access in server components.
*/
export const logoImageClass = css`
  inline-size: 3rem;
  block-size: 3rem;
  object-fit: contain;
  object-position: left;
`;
