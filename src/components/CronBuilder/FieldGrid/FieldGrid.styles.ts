import { styled } from "@linaria/react";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.875rem;
`;
