import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Field widget grid — two columns on large devices, one column on medium and small devices.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media ${BREAKPOINTS.lgAndLarger} {
    grid-template-columns: repeat(2, 1fr);
  }
`;
