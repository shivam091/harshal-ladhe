import { styled } from "@linaria/react";

// Matches code blocks' vertical rhythm so diagrams sit consistently with surrounding prose.
export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-block: clamp(0.75rem, 1vw, 1rem);
`;

// One responsive base so every diagram scales the same way, varying only its size and font.
export const Svg = styled.svg`
  inline-size: 100%;
  block-size: auto;
`;
