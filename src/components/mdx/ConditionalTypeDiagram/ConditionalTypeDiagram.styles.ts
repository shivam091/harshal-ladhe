import { css } from "@linaria/core";
import { styled } from "@linaria/react";

import { Svg as CommonSvg, Wrapper } from "@/components/mdx/common.styles";

export { Wrapper };

// Responsive SVG canvas, capped at the diagram's natural width.
export const Svg = styled(CommonSvg)`
  max-inline-size: 540px;
  overflow: visible;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
`;

// The top box: the type being fed in (the union itself, or its tuple-wrapped form) — neutral, since
// nothing has been checked or split yet.
export const inputBoxClass = css`
  fill: var(--color-bg-muted);
  stroke: var(--color-border-default);
  stroke-width: 1.5;
`;

// Each branch's `extends` check box — accent-colored, since this is the "machine" doing the work.
export const conditionBoxClass = css`
  fill: var(--color-bg-accent-muted);
  stroke: var(--color-border-accent-emphasis);
  stroke-width: 1.5;
`;

// Each branch's output box — success-colored, marking a value that has already passed its check.
export const outputBoxClass = css`
  fill: var(--color-bg-success-muted);
  stroke: var(--color-border-success-emphasis);
  stroke-width: 1.5;
`;

// The final result box — attention-colored, drawing the eye to "this is what the whole expression resolves to".
export const resultBoxClass = css`
  fill: var(--color-bg-attention-muted);
  stroke: var(--color-border-attention-emphasis);
  stroke-width: 1.5;
`;

// Split/join connector lines — muted, so colored boxes stay the focus.
export const connectorLineClass = css`
  stroke: var(--color-fg-muted);
  stroke-width: 1.5;
  fill: none;
`;

// Solid fill for every connector line's marker-end arrowhead triangle — needs its own class since the
// triangle is a filled <path>, not a stroked line, and connectorLineClass's `fill: none` would hide it.
export const arrowHeadClass = css`
  fill: var(--color-fg-muted);
`;

// Bold monospace styling for a box's primary label (union type, branch input/output, result).
export const primaryTextClass = css`
  font-size: 12px;
  font-weight: 600;
  fill: var(--color-fg-default);
`;

// Smaller muted styling for a condition box's second line (what the true branch resolves to).
export const detailTextClass = css`
  font-size: 10px;
  fill: var(--color-fg-muted);
`;

// Small italic styling shared by the split-note and join-note captions.
export const noteTextClass = css`
  font-size: 11px;
  font-style: italic;
  fill: var(--color-fg-muted);
`;
