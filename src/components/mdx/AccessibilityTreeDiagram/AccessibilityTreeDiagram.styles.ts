import { css } from "@linaria/core";
import { styled } from "@linaria/react";

import { Svg as CommonSvg, Wrapper } from "@/components/mdx/common.styles";

export { Wrapper };

// Responsive SVG canvas, capped at the diagram's natural width (wider than AxisDiagram's since it renders two columns side by side).
export const Svg = styled(CommonSvg)`
  max-inline-size: 600px;
  overflow: visible;
  font-family: 'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
`;

// Column-heading text above both the DOM and accessibility-tree boxes.
export const columnHeadingClass = css`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  fill: var(--color-fg-muted);
`;

// DOM-side box: neutral fill/border in both variants — the DOM markup itself isn't colored good/bad, only what it exposes is.
export const domBoxClass = css`
  fill: var(--color-bg-muted);
  stroke: var(--color-border-default);
  stroke-width: 1.5;
`;

// DOM box's markup line, e.g. `<button aria-label="Close">`.
export const domMarkupTextClass = css`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 11px;
  fill: var(--color-fg-default);
`;

// DOM box's rendered-content line — muted since it's illustrative context, not the point of the box.
export const domTextTextClass = css`
  font-size: 12px;
  fill: var(--color-fg-muted);
`;

// Accessibility-tree box when the node IS exposed — success-colored border marks it as "this works".
export const accessibleBoxClass = css`
  fill: var(--color-bg-muted);
  stroke: var(--color-fg-success);
  stroke-width: 1.5;
`;

// Accessibility-tree box when NOTHING is exposed — dashed danger-colored border makes the gap visible at a glance.
export const inaccessibleBoxClass = css`
  fill: var(--color-bg-muted);
  stroke: var(--color-fg-danger);
  stroke-width: 1.5;
  stroke-dasharray: 5 4;
`;

// role/name text inside an accessible node box.
export const accessibleTextClass = css`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 12px;
  fill: var(--color-fg-success);
`;

// "Not exposed" text inside an inaccessible node box.
export const inaccessibleTextClass = css`
  font-size: 12px;
  font-style: italic;
  fill: var(--color-fg-danger);
`;

// Shared line weight for both connector variants below.
export const connectorClass = css`
  stroke-width: 2;
  fill: none;
`;

// Connector line/arrowhead color when its row's node IS exposed.
export const connectorAccessibleClass = css`
  stroke: var(--color-fg-success);
  fill: var(--color-fg-success);
`;

// Connector line/arrowhead color (plus a dash pattern) when its row's node is NOT exposed.
export const connectorInaccessibleClass = css`
  stroke: var(--color-fg-danger);
  fill: var(--color-fg-danger);
  stroke-dasharray: 4 4;
`;
