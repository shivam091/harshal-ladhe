import { styled } from "@linaria/react";

export { Ghost } from "@/components/CurveRace/CurveRace.styles";
export { GuideLine } from "@/components/BezierGraph/BezierGraph.styles";

// Card surface sets the playground apart from the static graphs around it.
export const Wrapper = styled.div`
  margin-block: 3rem;
  margin-inline: auto;
  padding: 1.5rem;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.75rem;
  background: var(--color-bg-muted);
`;

// Centres the plot, which is narrower than the prose column.
export const GraphWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-block-end: 2rem;
`;

// Ringed in the background colour so the handle stays visible where it crosses the curve.
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

// Keeps the Play button beside the track it controls.
export const PreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-block-start: 2rem;
`;

// Dashed edges mark the start and finish lines the box travels between.
export const PreviewTrack = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-inline-size: 0;
  block-size: 2.5rem;
  border-block: 0.0625rem dashed var(--color-border-muted);
  background: var(--color-bg-default);
`;

// Same size and colour as the race markers, so readers recognise it as the same idea.
export const PreviewBox = styled.div`
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 50%;
  inline-size: 1.5rem;
  block-size: 1.5rem;
  border-radius: 624.9375rem;
  background: var(--color-fg-accent);
  box-shadow: var(--box-shadow-sm);
  /* Stays above the trail's raised endpoint dots. */
  z-index: 2;
`;

// Keeps the copy button next to the value it copies.
export const Readout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-block-start: 1.5rem;
`;

// Styled like inline code so it reads as something to paste into a stylesheet.
export const Code = styled.code`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.1875rem;
  background: var(--color-bg-control);
  color: var(--color-fg-accent);
`;
