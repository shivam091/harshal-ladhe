import { styled } from "@linaria/react";

// Intro copy above the tag cloud.
export const TagsSection = styled.section`
  p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    line-height: 1.625;
    margin-block-end: clamp(1rem, 1.25vw, 1.5rem);
  }
`;

// Wrapping pill cloud — one item per tag, each pairing a link with its count.
export const TagsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(0.75rem, 1vw, 1rem);
  padding: 0;
  list-style: none;
`;
