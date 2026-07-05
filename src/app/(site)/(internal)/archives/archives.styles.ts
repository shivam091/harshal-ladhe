import { styled } from "@linaria/react";

// Archives page section wrapper — intro paragraph sits above the timeline.
export const ArchivesSection = styled.section`
  p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    line-height: 1.625;
    margin-block-end: clamp(1rem, 1.25vw, 1.5rem);
  }
`;
