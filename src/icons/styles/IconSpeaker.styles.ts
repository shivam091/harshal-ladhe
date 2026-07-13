import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

// Root SVG — overflow visible so the waves aren't clipped when they translate outward.
export const Svg = styled.svg`
  display: block;
  overflow: visible;
`;

// Shared stroke styling for every animated path (speaker body + both waves).
export const Path = styled(animated.path)`
  stroke: currentColor;
  stroke-width: 2px;
`;

// Slides the speaker body left to meet the wrapper's left edge when sound is off.
export const SpeakerWrapper = styled.g`
  transform: translateX(var(--x));

  @media (prefers-reduced-motion: no-preference) {
    transition: transform 300ms;
  }
`;

// Speaker body path — wiggles briefly when sound is switched back on.
export const Speaker = styled(Path)`
  transform-origin: 30% center;

  @media (prefers-reduced-motion: no-preference) {
    &[data-should-wiggle="true"] {
      animation: speaker-wiggle 350ms;
    }
  }

  @keyframes speaker-wiggle {
    0% {
      transform: rotate(0deg);
    }

    25% {
      transform: rotate(15deg);
    }

    50% {
      transform: rotate(-13deg);
    }

    75% {
      transform: rotate(12deg);
    }

    100% {
      transform: rotate(0deg);
    }
  }
`;

// Fades each sound-wave arc in/out as sound is toggled on/off.
export const WaveWrapper = styled.g`
  @media (prefers-reduced-motion: no-preference) {
    transition: opacity 200ms;
  }
`;
