import { styled } from "@linaria/react";
import { skyFadeGradient } from "@/components/common.styles";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Clipped so the cloud never spills past the edge it's anchored to.
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  pointer-events: none;
`;

/*
  The keyframe's `to` matches the resting transform, so `backwards` fill is enough to hold it.
  Slid up to trim height because the path bulges in the middle and would otherwise run out of
  headroom on very large monitors.
*/
export const Svg = styled.svg`
  --initial-x-scale: 0.8;
  --final-y-translate: -30%;
  display: block;
  min-inline-size: 2000px;
  transform: scale(1, 2) translate(0%, var(--final-y-translate));
  transform-origin: top center;
  pointer-events: none;
  animation: bubble-in 500ms backwards;
  transition: transform 1000ms;

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

// Gradient matches the sky below the panel so the cloud blends into it.
export const Path = styled.path`
  background: ${skyFadeGradient("to top")};
`;
