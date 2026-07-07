import { styled } from "@linaria/react";

// Pops slightly on completion as a small flourish as the overlay fades out.
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
  One continuous stroke so a single dash animation can trace it like a hand re-signing; the
  path length (≈ 180 units) sets the dash values.
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
