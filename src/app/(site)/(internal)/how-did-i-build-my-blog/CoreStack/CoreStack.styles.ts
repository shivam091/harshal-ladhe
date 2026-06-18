import { styled } from "@linaria/react";

// min(100%, 260px) stops cards overflowing on viewports narrower than one column.
export const CoreStackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: 1rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
`;
