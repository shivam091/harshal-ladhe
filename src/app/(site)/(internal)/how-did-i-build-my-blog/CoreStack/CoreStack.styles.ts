import { styled } from "@linaria/react";

// Responsive auto-fill grid — collapses to single column on narrow viewports.
export const CoreStackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: var(--space-base);
  margin-block: var(--fluid-space-md);
`;
