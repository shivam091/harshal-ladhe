import { styled } from "@linaria/react";

// Responsive auto-fill grid — collapses to single column on narrow viewports.
export const CoreStackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: 1rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
`;
