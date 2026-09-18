import { styled } from "@linaria/react";

// Bounded square stage the shape is clipped within — a fixed aspect-ratio keeps the 0-100 coordinate space's X and Y visually equivalent, so a circle drawn at rx=ry actually looks round.
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

// The clip subject itself — sized to fill the stage entirely so its clip-path result reaches every edge.
export const ClipSubject = styled.div`
  position: absolute;
  inset: 0;
`;

// Solid-swatch clip subject — color comes through a CSS variable (set inline per-render) rather than a prop-driven template string, so switching the color doesn't regenerate a new Linaria class.
export const ColorSubject = styled(ClipSubject)`
  background: var(--subject-color, var(--color-bg-accent-emphasis));
`;

// Photo clip subject.
export const ImageSubject = styled.img`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
`;

// Fills the stage with the preview text at a size proportional to the box itself, so the clip always carves through actual glyph strokes rather than empty letter-spacing.
export const TextSubject = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  overflow: hidden;
  font-size: 18cqi;
  font-weight: 800;
  line-height: 0.9;
  text-align: center;
  word-break: break-word;
  color: var(--subject-color, var(--color-bg-accent-emphasis));
  background: var(--color-bg-muted);
  container-type: inline-size;
`;
