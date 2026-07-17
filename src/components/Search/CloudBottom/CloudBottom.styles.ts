import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Centers the cloud SVG and clips it to the bottom edge it's anchored to.
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  pointer-events: none;
`;

/*
  The cloud "bubbles in" on mount via a scale keyframe, then holds at the resting
  transform below (the keyframe's `to` matches it, so `animation-fill-mode: backwards`
  is enough to hold the end state — no `forwards` or JS-driven inline style needed).
  It's also slid up by --final-y-translate to trim its overall rendered height — the
  path bulges out in the middle, so there isn't enough headroom on very large monitors
  without the slide.
*/
export const Svg = styled.svg`
  --initial-x-scale: 0.8;
  --final-y-translate: -30%;
  display: block;
  min-inline-size: 2000px;
  transform: scale(1, 2) translate(0%, var(--final-y-translate));
  transform-origin: top center;
  will-change: transform;
  pointer-events: none;
  animation: bubble-in var(--motion-duration-slow) backwards;
  transition: transform var(--motion-duration-ultra-slow);

  path {
    pointer-events: auto;
  }

  @keyframes bubble-in {
    from {
      transform: scale(var(--initial-x-scale), 0) translate(0%, 0%);
    }

    to {
      transform: scale(1, 2) translate(0%, var(--final-y-translate));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }

  /* Slid up 30% to trim height; on very large monitors (90rem+) there's enough headroom to skip the slide. */
  @media ${BREAKPOINTS.wideAndLarger} {
    --final-y-translate: 0%;
  }

  /*
    The cloud also widens horizontally as it grows, which on wide screens can leave a jagged
    edge since the SVG isn't large enough once shrunk down by 20%. Widen the starting scale
    on bigger screens so it never runs out of path.
  */
  @media ${BREAKPOINTS.xwideAndLarger} {
    --initial-x-scale: 0.9;
  }

  @media ${BREAKPOINTS.ultrawideAndLarger} {
    --initial-x-scale: 1;
  }
`;

// Cloud silhouette fill — a soft vertical gradient matching the sky background below the panel.
export const Path = styled.path`
  background: linear-gradient(
    to top,
    hsl(from var(--color-bg-sky-subtle) h s l / 0.925),
    var(--color-bg-sky-subtle)
  );
`;
