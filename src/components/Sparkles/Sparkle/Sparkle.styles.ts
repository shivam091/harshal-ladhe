import { styled } from "@linaria/react";

// The pop-in/out scale animation lives here so it plays once per mount and never restarts mid-flight.
export const SparkleWrapper = styled.span`
  position: absolute;
  display: block;
  pointer-events: none;

  @media (prefers-reduced-motion: no-preference) {
    animation: sparkle-come-in-out 900ms forwards;
    will-change: transform;
  }

  @keyframes sparkle-come-in-out {
    0% {
      transform: translate3d(-50%, -50%, 0) scale(0);
    }

    50% {
      transform: translate3d(-50%, -50%, 0) scale(1);
    }

    100% {
      transform: translate3d(-50%, -50%, 0) scale(0);
    }
  }
`;

// Spins the sparkle's SVG artwork once as it appears.
export const SparkleSvg = styled.svg`
  display: block;

  @media (prefers-reduced-motion: no-preference) {
    animation: sparkle-spin 1000ms linear;
    will-change: transform;
  }

  @keyframes sparkle-spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(100deg);
    }
  }
`;
