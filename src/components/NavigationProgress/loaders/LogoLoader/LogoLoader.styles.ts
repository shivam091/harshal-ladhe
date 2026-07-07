import { styled } from "@linaria/react";

/*
  SVG wrapper for the monogram mark — glow lifted from the bar's accent colour. Pops slightly
  on completion (`data-state="done"`) as a small flourish right as the overlay fades out.
*/
export const LogoSvg = styled.svg`
  position: relative;
  z-index: 1;
  inline-size: 56px;
  block-size: 56px;
  filter: drop-shadow(0 0 6px hsl(from var(--color-fg-accent) h s l / 0.45));
  transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1);

  &[data-state="done"] {
    transform: scale(1.12);
  }
`;

/*
  "H" monogram drawn as a single continuous pen stroke (down the left leg, back up partway,
  across the crossbar, up and down the right leg — the short retrace over the left leg is
  invisible since it's the same line drawn twice). Path length ≈ 180 units.

  While loading, `logo-draw` sweeps stroke-dashoffset from +length → 0 → -length on a loop:
  the first half draws the mark in, the second half "erases" it from the start, like a hand
  re-tracing a signature. On completion the loop is dropped, the offset snaps to 0 (fully
  drawn) and a soft tint fades in behind the stroke.
*/
export const LogoPath = styled.path`
  fill: none;
  stroke: var(--color-fg-accent);
  stroke-width: 7;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 180;
  stroke-dashoffset: 180;
  transition:
    stroke-dashoffset 320ms cubic-bezier(0.34, 1.56, 0.64, 1),
    fill 280ms ease 200ms;
  animation: logo-draw 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite;

  @keyframes logo-draw {
    0% {
      stroke-dashoffset: 180;
    }
      
    50% {
      stroke-dashoffset: 0;
    }
      
    100% {
      stroke-dashoffset: -180;
    }
  }

  &[data-state="done"] {
    animation: none;
    stroke-dashoffset: 0;
    fill: hsl(from var(--color-fg-accent) h s l / 0.15);
  }
`;
