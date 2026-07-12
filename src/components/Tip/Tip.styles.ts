import { css } from "@linaria/core";
import { styled } from "@linaria/react";

// SVG container for the curved tip — overflow:visible lets the shape bleed outside the panel bounds.
export const Tip = styled.svg`
  overflow: visible;
`;

// Filled SVG path of the tip — className applied to animated.path in the component.
export const tipPathClass = css`
  fill: var(--color-bg-overlay);
`;
