import { styled } from "@linaria/react";

// Positions the progress dots relative to the reset button itself.
export const Wrapper = styled.div`
  position: relative;
`;

// Centers the dot row above the button, floating above its box so it doesn't affect toolbar layout/height.
export const ProgressWrapper = styled.div`
  position: absolute;
  inset-block-end: 100%;
  inset-inline: 0;
  z-index: 3;
  display: flex;
  justify-content: center;
  padding-block-end: var(--space-xxxs);
  pointer-events: none;
`;
