import { styled } from "@linaria/react";

// LinkedIn's feed card: full-bleed image with a tinted text band below, no rounded outline of its own.
export const LinkedInCard = styled.div`
  overflow: hidden;
  border-radius: 0.5rem;
  background: var(--surface-subtle);
`;

// LinkedIn shows only the title and domain under the image — no description in the feed.
export const LinkedInText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem 0.625rem;
`;

// Semibold, two lines max — LinkedIn's own clamp.
export const LinkedInTitle = styled.strong`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.35;
`;

// The domain line in LinkedIn's secondary grey.
export const LinkedInHost = styled.span`
  font-size: 0.75rem;
  color: var(--surface-muted);
`;
