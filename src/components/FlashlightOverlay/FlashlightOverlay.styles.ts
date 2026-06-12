import { styled } from "@linaria/react";

// Pinned to a corner so the toggle stays reachable however far the page is scrolled.
export const ToggleContainer = styled.div`
  position: fixed;
  inset-block-end: 1.5rem;
  inset-inline-end: 1.5rem;
  z-index: 1001;
`;
