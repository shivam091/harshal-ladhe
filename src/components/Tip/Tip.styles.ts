import { css } from "@linaria/core";
import { styled } from "@linaria/react";

// Visible overflow so the curve isn't clipped where it meets the panel edge.
export const Tip = styled.svg`
  overflow: visible;
`;

// Shares the overlay background token so the tip always reads as part of the panel it hangs off.
export const tipPathClass = css`
  fill: var(--color-bg-overlay);
`;
