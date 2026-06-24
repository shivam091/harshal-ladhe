import { styled } from "@linaria/react";

// Full-bleed overlay layer: clips the shimmer animation to the parent's rounded border without creating a scroll container.
export const ShimmerWrapper = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: clip;
`;

// Gradient sweep that plays a single slide-and-fade animation per trigger; blend mode and color adapt per theme.
export const ShimmerSweep = styled.div`
  position: absolute;
  inset: 0;
  inline-size: 150%;
  block-size: 100%;
  inset-inline-start: -25%;
  background: linear-gradient(
    to right,
    transparent 38%,
    var(--shimmer-color) 47%,
    var(--shimmer-color) 53%,
    transparent 62%
  );
  animation:
    shimmer-slide 750ms ease-in-out both,
    shimmer-fade 900ms ease-in-out both;
  will-change: transform;
  mix-blend-mode: var(--shimmer-blend);

  [data-theme="light"] & {
    --shimmer-color: hsl(0deg 0% 100% / 0.7);
    --shimmer-blend: overlay;
  }

  [data-theme="dark"] & {
    --shimmer-color: hsl(210deg 15% 70% / 0.18);
    --shimmer-blend: lighten;
  }

  [data-theme="soft-dark"] & {
    --shimmer-color: hsl(210deg 15% 70% / 0.15);
    --shimmer-blend: lighten;
  }

  --shimmer-color: hsl(210deg 15% 70% / 0.18);
  --shimmer-blend: lighten;

  // Slide-and-fade sweep: shimmer-slide translates the oversized gradient panel across the block.
  @keyframes shimmer-slide {
    from {
      transform: translateX(-40%);
    }

    to {
      transform: translateX(40%);
    }
  }

  // shimmer-fade controls opacity so the sweep fades in and out around the slide; runs simultaneously with shimmer-slide.
  @keyframes shimmer-fade {
    0% {
      opacity: 0;
    }

    15% {
      opacity: 1;
    }

    65% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
`;
