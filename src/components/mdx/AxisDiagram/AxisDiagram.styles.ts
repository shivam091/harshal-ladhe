import { css } from "@linaria/core";
import { styled } from "@linaria/react";

import { Svg as CommonSvg, Wrapper } from "@/components/mdx/common.styles";

export { Wrapper };

// Responsive SVG canvas, capped at the diagram's natural width.
export const Svg = styled(CommonSvg)`
  max-inline-size: 480px;
  overflow: visible;
  font-family: 'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
`;

// Diagram's outer box: muted fill, default border.
export const boxClass = css`
  fill: var(--color-bg-muted);
  stroke: var(--color-border-default);
  stroke-width: 1.5;
`;

// Inline-axis color, shared by its arrow, edge text, and legend entry.
export const inlineAxisClass = css`
  stroke: var(--color-fg-accent);
  fill: var(--color-fg-accent);
`;

// Block-axis color, shared by its arrow, edge text, and legend entry.
export const blockAxisClass = css`
  stroke: var(--color-fg-attention);
  fill: var(--color-fg-attention);
`;

// Shared line weight and rounded caps for both axis arrows and legend swatches.
export const arrowLineClass = css`
  stroke-width: 2.5;
  stroke-linecap: round;
`;

// Small uppercase tag styling for legend labels.
export const axisTagClass = css`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;
