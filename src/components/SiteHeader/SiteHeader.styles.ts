import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import Link from "next/link";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Stays pinned while scrolling and fades in a glass backdrop so content scrolling beneath never fights the nav for legibility.
export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  position: sticky;
  inset-block-start: var(--header-top-offset);
  inset-inline: 0;
  z-index: 1001;
  block-size: 5rem;
  padding: clamp(0.75rem, 1vw, 1rem);
  color: var(--color-fg-accent-muted);
  gap: 0.75rem;

  @media ${BREAKPOINTS.mobile} {
    gap: 0.5rem;
    justify-content: space-between;
    min-block-size: 5rem;
    block-size: auto;
  }

  background: hsl(from var(--color-bg-sky-from) h s l / var(--glass-opacity));
  backdrop-filter: blur(var(--blur-amount));
  transition:
    color 350ms cubic-bezier(0.41, 0.1, 0.13, 1),
    --color-bg-sky-from calc(350ms + 500ms) cubic-bezier(0.41, 0.1, 0.13, 1);
  will-change: background, backdrop-filter, inset-block-start;

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

  // Animates typed custom properties because untyped ones can't interpolate — they're registered in _properties.scss.
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

// Logo and name share one link so the whole brand block is a single, generous home target.
export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.125rem;
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
