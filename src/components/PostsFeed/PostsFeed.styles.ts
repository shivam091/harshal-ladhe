import { styled } from "@linaria/react";

// Centres "Show more" under the feed so it reads as the list's continuation.
export const ShowMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-block-start: clamp(1rem, 1.25vw, 1.5rem);
`;
