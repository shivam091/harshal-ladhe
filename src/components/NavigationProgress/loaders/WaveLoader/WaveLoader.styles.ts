import { styled } from "@linaria/react";

export const WaveSvg = styled.svg`
  position: relative;
  z-index: 1;
  inline-size: 72px;
  block-size: 72px;
  filter: drop-shadow(0 0 6px hsl(from var(--color-fg-accent) h s l / 0.35));
`;

// Faint static ring outlining the fill container, echoing the dots loader's orbit guides.
export const WaveGuide = styled.circle`
  fill: none;
  stroke: var(--color-border-default);
  stroke-width: 1;
  opacity: 0.25;
`;

/*
  Vertical position is driven by an inline `transform` from WaveLoader.tsx, computed straight
  from the real `progress` value (0-100) — the water level is a literal readout, not a looping
  animation of its own. The transition here is what makes level changes glide instead of jump.
*/
export const WaveLevel = styled.g`
  transition: transform 260ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
`;

/*
  One seamless period (40 units) of the water's surface, repeated 4× across the shape — see
  WaveLoader.tsx for the exact path. `wave-scroll` translates by exactly one period so the
  loop has no visible seam. Kept as a separate animation/property (`transform` here, not
  touched by WaveLevel above) so the horizontal scroll and the vertical fill level never
  fight over the same value.
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
