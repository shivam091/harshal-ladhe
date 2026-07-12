import { styled } from "@linaria/react";

// One shell for both route groups so home and internal pages keep identical landmark structure and padding.

// Grows to push the footer down on short pages; z-index keeps content above the decorative sky banner.
export const Main = styled.main`
  flex: 1;
  max-inline-size: 100%;
  z-index: 1000;
  container-type: inline-size;
  padding: clamp(0.75rem, 1vw, 1rem);
`;

// z-index lifts the heading above the hero banner behind it.
export const PageHeading = styled.section`
  z-index: 10;
`;

// A named section so internal pages get a labelled region landmark via aria-labelledby.
export const PageContent = styled.section`

`;
