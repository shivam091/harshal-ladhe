import { styled } from "@linaria/react";

// Bounded square stage the path renders within — a fixed aspect-ratio keeps the 0-100 coordinate space's X and Y visually equivalent, matching ClipPathGenerator's own PreviewStage.
export const PreviewStage = styled.div`
  position: relative;
  /* Explicit inline-size rather than relying on flex/grid stretch — every child here is position:absolute (contributes nothing to intrinsic content size), so an ancestor's stretch alignment resolving to "auto" leaves this box with no width to derive its aspect-ratio height from. */
  inline-size: 100%;
  aspect-ratio: 1 / 1;
  max-inline-size: 32rem;
  margin-inline: auto;
  overflow: hidden;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  background-image:
    linear-gradient(45deg, var(--color-bg-neutral-muted) 25%, transparent 25%),
    linear-gradient(-45deg, var(--color-bg-neutral-muted) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--color-bg-neutral-muted) 75%),
    linear-gradient(-45deg, transparent 75%, var(--color-bg-neutral-muted) 75%);
  background-size: 1.25rem 1.25rem;
  background-position: 0 0, 0 0.625rem, 0.625rem -0.625rem, -0.625rem 0;
`;

// The actual rendered result, sized to fill the stage — deliberately NOT non-scaling-stroke like the overlay's editor-aid outline: this is a real WYSIWYG preview of the exported markup, so its stroke should scale with the viewBox exactly the way it will wherever the exported `<svg>` gets dropped.
export const RenderedSvg = styled.svg`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
`;
