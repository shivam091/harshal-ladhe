import { styled } from "@linaria/react";

// Stacked above the frosted backdrop so the rings aren't blurred, with a glow in the bar's accent colour so the overlay reads as part of the same progress indicator.
export const RingsSvg = styled.svg`
  position: relative;
  z-index: 1;
  inline-size: 80px;
  block-size: 80px;
  filter: drop-shadow(0 0 6px hsl(from var(--color-fg-accent) h s l / 0.45));
`;

/*
  `transform-box: fill-box` is needed for `transform-origin: center` to pivot an SVG circle on
  its own centre. The animation is declared here rather than per variant because Linaria scopes
  the ring-dash name to this block, so a variant redeclaring it would point at a keyframe that
  doesn't exist. The step turn uses the separate `rotate` property so it adds to the spin's
  `transform` instead of replacing it.
*/
const Ring = styled.circle`
  transform-box: fill-box;
  transform-origin: center;
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  will-change: transform;
  /* Shared and unhurried so the spin stays calm; the rings still differ through easing, direction, and dash timing. */
  --spin-duration: 4.5s;
  animation:
    spin var(--spin-duration) var(--spin-easing) infinite var(--direction, normal),
    ring-dash var(--dash-duration) ease-in-out infinite var(--direction, normal),
    ring-step calc(var(--dash-duration) * 5) steps(5) infinite var(--direction, normal);

  /*
    Ends on the same one-unit dot it starts from, so the loop restarts without a jump. The 200 gap
    is longer than the 100-unit ring, so a second dash can never appear.
  */
  @keyframes ring-dash {
    0% {
      stroke-dasharray: 1 200;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: var(--arc) 200;
      stroke-dashoffset: -25;
    }

    100% {
      stroke-dasharray: var(--arc) 200;
      stroke-dashoffset: -99;
    }
  }

  /*
    Five steps over five dash cycles, so each step lands exactly when the arc is back to a dot.
    The jump is too small to see there, and every loop starts a fifth of a turn further round.
  */
  @keyframes ring-step {
    to {
      rotate: 1turn;
    }
  }
`;

// Largest arc on the slowest dash cycle so the outer ring anchors the trio.
export const OuterRing = styled(Ring)`
  --arc: 75;
  --spin-easing: cubic-bezier(0.37, 0, 0.63, 1);
  --dash-duration: 2.6s;
  stroke: var(--color-fg-attention);
`;

// Counter-rotates so the trio reads as layered rather than one block; the dash reverses with it so it never chases against its own spin.
export const MiddleRing = styled(Ring)`
  --arc: 66.667;
  --spin-easing: cubic-bezier(0.45, 0, 0.55, 1);
  --dash-duration: 2.3s;
  --direction: reverse;
  stroke: var(--color-fg-success);
`;

// Smallest arc on the quickest dash cycle so the centre carries the most energy.
export const InnerRing = styled(Ring)`
  --arc: 50;
  --spin-easing: cubic-bezier(0.33, 0, 0.67, 1);
  --dash-duration: 2s;
  stroke: var(--color-fg-accent);
`;
