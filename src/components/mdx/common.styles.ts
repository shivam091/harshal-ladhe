import { styled } from "@linaria/react";

// Wrapper matches CodeBlock's own vertical rhythm so the diagram sits consistently with surrounding prose. Shared by every mdx diagram.
export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-block: clamp(0.75rem, 1vw, 1rem);
`;

// Base responsive SVG canvas shared by every mdx diagram. Each diagram extends this with its own max-inline-size and font-family.
export const Svg = styled.svg`
  inline-size: 100%;
  block-size: auto;
`;
