import { css } from "@linaria/core";
import { styled } from "@linaria/react";

import { Svg as CommonSvg, Wrapper } from "@/components/mdx/common.styles";

export { Wrapper };

// Responsive SVG canvas — wider than most mdx diagrams since this one is a horizontal pipeline.
export const Svg = styled(CommonSvg)`
  max-inline-size: 640px;
  font-family: 'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
`;

// Bold heading text shared by a group band's banner and a phase box's title.
export const headingTextClass = css`
  font-weight: 700;
`;

// Smaller muted caption shared by a group band's sublabel and a phase box's description line.
export const captionTextClass = css`
  font-size: 10px;
  fill: var(--color-fg-muted);
`;

// Monospace note styling for the restart-arc label and the effects-ordering footnote.
export const noteTextClass = css`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 10px;
  fill: var(--color-fg-muted);
`;
