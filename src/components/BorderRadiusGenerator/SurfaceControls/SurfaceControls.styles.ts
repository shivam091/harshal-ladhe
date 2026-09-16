import { styled } from "@linaria/react";

// Pairs the clay and worktable color pickers side by side — two color swatches sitting next to each other like paired glaze/slab samples.
export const ColorPairRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;
