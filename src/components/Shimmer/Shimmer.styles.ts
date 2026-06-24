import { styled } from "@linaria/react";

// clip rather than hidden keeps the sweep inside rounded corners without creating a scroll container.
export const ShimmerWrapper = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: clip;
`;

// Colour and blend mode are themed because no single overlay reads well on both light and dark surfaces.
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

  // The panel is wider than the block so the highlight band can travel fully across it.
  @keyframes shimmer-slide {
    from {
      transform: translateX(-40%);
    }

    to {
      transform: translateX(40%);
    }
  }

  // Longer than the slide so the band eases in and out instead of popping at the edges.
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
