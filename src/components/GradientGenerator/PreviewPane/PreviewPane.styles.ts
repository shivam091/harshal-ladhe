import { styled } from "@linaria/react";

/*
  The bounded rectangle the live gradient actually paints into — sitting between the toolbar and the
  rest of the controls rather than behind the whole tool, so an arbitrarily bright or saturated
  gradient never has to double as a legible backdrop for glass panel text (see GradientGenerator.styles
  for why the outer Canvas shell stopped doing that). `background` is set inline per-render from
  compileGradientValue, the same single source of truth ExportPanel's own code block reads from.
*/
export const Stage = styled.div`
  inline-size: 100%;
  block-size: clamp(6rem, 18vw, 9rem);
  border-radius: 0.75rem;
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 60%, transparent);
  box-shadow: var(--box-shadow-sm);
`;

// Truncated monospace readout of the exact compiled gradient value beneath the swatch — a glanceable "what am I looking at" distinct from ExportPanel's full copyable code block further down.
export const ValueReadout = styled.p`
  margin: 0.625rem 0 0;
  max-inline-size: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
