import { styled } from "@linaria/react";

// Rounded scene container — fixed aspect ratio, clips cloud and ground layers at the border-radius.
export const Scene = styled.div`
  position: relative;
  border-radius: 0.375rem;
  overflow: clip;
  aspect-ratio: 18 / 10;
  max-block-size: 15.625rem;
  background-image: linear-gradient(to top, var(--color-bg-sky-to) 30%, var(--color-bg-sky-from) 100%);
  margin-block-start: auto;
`;

// Absolute cloud SVG — wider than the scene container, anchored to the bottom-right.
export const Cloud = styled.svg`
  max-inline-size: none;
  position: absolute;
  min-inline-size: 29.6875rem;
  inline-size: 85%;
  block-size: 14rem;
  inset-block: auto -1px;
  inset-inline: auto -1px;
`;

// Sky-subtle fill for the cloud silhouette.
export const CloudFill = styled.path`
  fill: var(--color-bg-sky-subtle);
`;

// Ground silhouette SVG — covers the bottom half of the scene container.
export const Ground = styled.svg`
  max-inline-size: none;
  position: absolute;
  inline-size: calc(100% + 3px);
  block-size: 50%;
  inset-block: auto -1px;
  inset-inline: -1.5px -1px;
`;

// Default-background fill for the ground silhouette — transitions with the theme.
export const GroundFill = styled.path`
  fill: var(--color-bg-default);
`;
