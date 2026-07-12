import { styled } from "@linaria/react";

// Fixed bottom-right anchor for the enable/disable button — appears only when showToggle is true.
export const ToggleContainer = styled.div`
  position: fixed;
  inset-block-end: var(--space-lg);
  inset-inline-end: var(--space-lg);
  z-index: 1001;
`;
