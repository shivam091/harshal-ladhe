import { styled } from "@linaria/react";

export const PreviewStage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

export const ScrubberReadout = styled.p`
  margin: 0;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

/*
  The "as-if browser window" — its own inline-size is a percentage of the card (never a literal px
  width, which could overflow small screens), scaled between MIN_STAGE_PERCENT and 100 by
  normalize() as the preview-width slider moves across [minViewport, maxViewport] — so dragging it
  narrower visibly shrinks this box the same way resizing a real browser window would.
*/
export const ScaledViewport = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1rem;
  overflow: hidden;
  background: var(--color-bg-default);
  border: 0.0625rem dashed var(--color-border-default);
  border-radius: 0.375rem;
  transition: inline-size 120ms ease;
`;

export const StepRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-inline-size: 0;
`;

export const StepMeta = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  color: var(--color-fg-muted);
`;

export const StepSample = styled.span`
  max-inline-size: 100%;
  overflow-wrap: break-word;
  line-height: 1.2;
  color: var(--color-fg-default);
`;
