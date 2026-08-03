import { styled } from "@linaria/react";

// min-height matches a single line of text at font-size-sm to prevent layout shift during hydration.
export const Wrapper = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-fg-accent-muted);
  font-style: italic;
  line-height: var(--line-height-relaxed);
  min-height: 1.3125rem;
  font-weight: var(--font-weight-medium);
`;
