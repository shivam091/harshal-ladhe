import { styled } from "@linaria/react";

// min-height matches a single line of text at font-size-sm to prevent layout shift during hydration.
export const Wrapper = styled.p`
  font-size: 0.875rem;
  color: var(--color-fg-accent-muted);
  font-style: italic;
  line-height: 1.625;
  min-height: 1.3125rem;
  font-weight: 500;
`;
