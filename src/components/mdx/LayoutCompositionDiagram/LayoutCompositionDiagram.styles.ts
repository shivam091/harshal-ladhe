import { css } from "@linaria/core";
import { styled } from "@linaria/react";

import { Svg as CommonSvg, Wrapper } from "@/components/mdx/common.styles";

export { Wrapper };

// Responsive SVG canvas, capped at the diagram's natural width — wide enough for both panels side by side.
export const Svg = styled(CommonSvg)`
  max-inline-size: 560px;
  overflow: visible;
  font-family: 'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
`;

// Fill/stroke for a segment box that stays mounted across the navigation shown (the root and dashboard layouts).
export const persistBoxClass = css`
  fill: var(--color-bg-success-muted);
  stroke: var(--color-border-success-emphasis);
  stroke-width: 1.5;
`;

// Fill/stroke for a segment box that's torn down and remounted across the navigation shown (the page).
export const swapBoxClass = css`
  fill: var(--color-bg-attention-muted);
  stroke: var(--color-border-attention-emphasis);
  stroke-width: 1.5;
`;

// Bold title styling for a segment box's label (e.g. "Dashboard Layout").
export const segmentTitleClass = css`
  font-size: 12px;
  font-weight: 600;
  fill: var(--color-fg-default);
`;

// Muted monospace styling for a segment box's file-path subtitle.
export const segmentFileClass = css`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 10px;
  fill: var(--color-fg-muted);
`;

// Large centered label for the leaf page's visible content — the one thing that actually changes between states.
export const contentLabelClass = css`
  font-size: 13px;
  font-weight: 600;
  fill: var(--color-fg-default);
  text-anchor: middle;
`;

// Monospace route caption rendered above each panel.
export const captionClass = css`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 12px;
  font-weight: 600;
  fill: var(--color-fg-default);
  text-anchor: middle;
`;

// Connecting arrow between the two panels, showing the direction of the navigation being compared.
export const arrowLineClass = css`
  stroke: var(--color-fg-muted);
  stroke-width: 2;
`;

// Label rendered above the connecting arrow (e.g. "navigate").
export const arrowLabelClass = css`
  font-size: 10px;
  fill: var(--color-fg-muted);
  text-anchor: middle;
`;

// Small uppercase legend label text, color-matched to its swatch by the caller.
export const legendTextClass = css`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;
