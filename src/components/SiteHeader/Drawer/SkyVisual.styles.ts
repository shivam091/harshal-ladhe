import { styled } from "@linaria/react";

// Fixed aspect ratio keeps the art's proportions; clipping keeps the oversized layers inside the rounded corners.
export const Scene = styled.div`
  position: relative;
  border-radius: 0.375rem;
  overflow: clip;
  aspect-ratio: 18 / 10;
  max-block-size: 15.625rem;
  background-image: linear-gradient(to top, var(--color-bg-sky-to) 30%, var(--color-bg-sky-from) 100%);
  margin-block-start: auto;
  transition:
    --color-bg-sky-from calc(350ms + 500ms) cubic-bezier(0.41, 0.1, 0.13, 1),
    --color-bg-sky-to calc(350ms + 350ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Minimum width stops the cloud squashing on narrow screens — it overflows and is clipped instead.
export const Cloud = styled.svg`
  max-inline-size: none;
  position: absolute;
  min-inline-size: 29.6875rem;
  inline-size: 85%;
  block-size: 14rem;
  inset-block: auto -1px;
  inset-inline: auto -1px;
`;

// Theme token so the cloud follows the active color scheme.
export const CloudFill = styled.path`
  fill: var(--color-bg-sky-subtle);
  transition: fill calc(350ms + 120ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Slightly oversized with negative insets so no hairline gaps show at the scene's edges.
export const Ground = styled.svg`
  max-inline-size: none;
  position: absolute;
  inline-size: calc(100% + 3px);
  block-size: 50%;
  inset-block: auto -1px;
  inset-inline: -1.5px -1px;
`;

// Matches the drawer background so the ground blends seamlessly into the panel below.
export const GroundFill = styled.path`
  fill: var(--color-bg-default);
  transition: fill 350ms cubic-bezier(0.41, 0.1, 0.13, 1);
`;
