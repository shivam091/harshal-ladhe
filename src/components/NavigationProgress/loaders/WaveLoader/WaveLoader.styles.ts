import { styled } from "@linaria/react";

// Soft accent glow lifts the liquid off the page background.
export const WaveSvg = styled.svg`
  position: relative;
  z-index: 1;
  inline-size: 72px;
  block-size: 72px;
  filter: drop-shadow(0 0 6px hsl(from var(--color-fg-accent) h s l / 0.35));
`;

// Faint ring outlining the container so the fill level reads against a clear boundary.
export const WaveGuide = styled.circle`
  fill: none;
  stroke: var(--color-border-default);
  stroke-width: 1;
  opacity: 0.25;
`;

/*
  Positioned inline from real progress so the level is a literal readout; the transition makes
  changes glide instead of jump.
*/
export const WaveLevel = styled.g`
  transition: transform 260ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
`;

/*
  Scrolls exactly one period so the loop has no seam, on a separate property from the level so
  the two motions never fight.
*/
export const WaveShape = styled.path`
  fill: hsl(from var(--color-fg-accent) h s l / 0.55);
  animation: wave-scroll 2.2s linear infinite;
  will-change: transform;

  @keyframes wave-scroll {
    to {
      transform: translateX(-40px);
    }
  }

  &[data-state="done"] {
    animation-play-state: paused;
  }
`;

// A second, dimmer layer scrolling at a different speed/direction for a bit of depth.
export const WaveShapeBack = styled(WaveShape)`
  fill: hsl(from var(--color-fg-accent) h s l / 0.28);
  animation-duration: 3.4s;
  animation-direction: reverse;
`;
