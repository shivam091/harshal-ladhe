import { styled } from "@linaria/react";

// A received message bubble — heavily rounded, capped narrower than the other cards the way chat bubbles are.
export const Bubble = styled.div`
  max-inline-size: 17rem;
  overflow: hidden;
  border-radius: 1.125rem;
  background: var(--surface-subtle);
`;

// Title and domain under the image; with no image, the favicon joins them on one compact row.
export const BubbleText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem 0.625rem;
  line-height: 1.3;
`;

// Title above domain inside the text row.
export const BubbleLines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-inline-size: 0;
`;

// Bold title, two lines at most.
export const BubbleTitle = styled.strong`
  font-size: 0.875rem;
  font-weight: 600;
`;

// The bare domain in muted grey.
export const BubbleHost = styled.span`
  font-size: 0.75rem;
  color: var(--surface-muted);
`;
