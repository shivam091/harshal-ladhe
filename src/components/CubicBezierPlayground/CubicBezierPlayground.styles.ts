import { styled } from "@linaria/react";

export { Ghost } from "@/components/CurveRace/CurveRace.styles";

// Outer spacing wrapper.
export const Wrapper = styled.div`
  margin-block: var(--space-xxl);
  margin-inline: auto;
  padding: var(--space-lg);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--border-radius-lg);
  background: var(--color-bg-muted);
`;

// Centers the draggable SVG plot.
export const GraphWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-block-end: var(--space-xl);
`;

// Dashed line from a fixed anchor (0,0 or 1,1) to its control-point handle.
export const GuideLine = styled.line`
  stroke: var(--color-fg-muted);
  stroke-width: 2px;
  stroke-dasharray: 4 4;
  opacity: var(--opacity-medium);
`;

// A draggable control-point handle.
export const Handle = styled.circle`
  fill: var(--color-bg-accent-emphasis);
  stroke: var(--color-bg-default);
  stroke-width: 2px;
  cursor: grab;
  pointer-events: auto;

  &:active {
    cursor: grabbing;
  }
`;

// Row pairing the preview track with its Play button.
export const PreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-base);
  margin-block-start: var(--space-xl);
`;

// The track the preview marker slides along.
export const PreviewTrack = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-inline-size: 0;
  block-size: var(--size-xxl);
  border-block: var(--border-width-thin) dashed var(--color-border-muted);
  background: var(--color-bg-default);
`;

// The live preview marker.
export const PreviewBox = styled.div`
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 50%;
  inline-size: var(--size-lg);
  block-size: var(--size-lg);
  border-radius: var(--border-radius-full);
  background: var(--color-fg-accent);
  box-shadow: var(--box-shadow-sm);
`;

// Row pairing the generated cubic-bezier() readout with its copy button.
export const Readout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin-block-start: var(--space-lg);
`;

// Monospace readout of the current cubic-bezier() value.
export const Code = styled.code`
  font-family: var(--font-stack-monospace);
  font-size: var(--font-size-sm);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--border-radius-sm);
  background: var(--color-bg-control);
  color: var(--color-fg-accent);
`;
