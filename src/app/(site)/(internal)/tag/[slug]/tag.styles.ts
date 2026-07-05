import { styled } from "@linaria/react";

// Per-tag archive wrapper — the intro line sits above the reused post feed.
export const TagArchiveSection = styled.section``;

// Kicker above the title — the raw "#tag" plus its post count, muted.
export const TagArchiveKicker = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-fg-muted);
  font-weight: var(--font-weight-medium);
  margin-block: var(--space-lg);

  .tag-count {
    color: var(--color-fg-neutral);
  }
`;

export const TagDescription = styled.p`
  font-size: var(--fluid-font-size-md);
  line-height: var(--line-height-relaxed);
  margin-block-end: var(--fluid-space-base);
`;
