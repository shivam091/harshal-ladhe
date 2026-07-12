import { styled } from "@linaria/react";

// Shared by (home)/layout.tsx and (internal)/layout.tsx — both wrap their content slot in an identical <main> + padded <div>.

// Flex-growing main content area — z-index 1000 keeps it above the decorative sky banner.
export const Main = styled.main`
  flex: 1;
  max-inline-size: 100%;
  z-index: 1000;
  container-type: inline-size;
  padding: clamp(0.75rem, 1vw, 1rem);
`;

// Stacking context for the page heading — sits above the hero banner via z-index.
export const PageHeading = styled.section`
  z-index: 10;
`;

// Styles for page content section
export const PageContent = styled.section`

`;
