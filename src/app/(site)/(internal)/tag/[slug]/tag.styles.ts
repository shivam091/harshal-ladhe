import { styled } from "@linaria/react";

// Per-tag archive wrapper — the intro line sits above the reused post feed.
export const TagArchiveSection = styled.section``;

// Kicker above the title — the raw "#tag" plus its post count, muted.
export const TagArchiveKicker = styled.p`
  font-size: 0.875rem;
  color: var(--color-fg-muted);
  font-weight: 500;
  margin-block: 1.5rem;

  .tag-count {
    color: var(--color-fg-neutral);
  }
`;

export const TagDescription = styled.p`
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.625;
  margin-block-end: clamp(1rem, 1.25vw, 1.5rem);
`;
