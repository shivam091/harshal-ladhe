import { styled } from "@linaria/react";

// Fixed bottom-right anchor for the enable/disable button — appears only when showToggle is true.
export const ToggleContainer = styled.div`
  position: fixed;
  inset-block-end: 1.5rem;
  inset-inline-end: 1.5rem;
  z-index: 1001;
`;
