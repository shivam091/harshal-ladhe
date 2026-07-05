import { styled } from "@linaria/react";

// Intro copy above the tag cloud.
export const TagsSection = styled.section`
  p {
    font-size: var(--fluid-font-size-md);
    line-height: var(--line-height-relaxed);
    margin-block-end: var(--fluid-space-base);
  }
`;

// Wrapping pill cloud — one item per tag, each pairing a link with its count.
export const TagsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: var(--fluid-space-md);
  padding: 0;
  list-style: none;
`;

// A single tag pill: the #name link plus a muted count badge.
export const TagItem = styled.li`
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-bg-muted);
  border: var(--border-width-default) solid var(--color-border-muted);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  margin-block-end: var(--space-none);
  box-shadow: var(--box-shadow-sm);
  transition-property: background-color, border-color, box-shadow;
  transition-duration: var(--motion-duration-medium);
  transition-timing-function: var(--motion-easing-ease-in-out);

  // Accent border + shadow lift on hover, matching the Badge component treatment.
  &:hover {
    border-color: var(--color-border-accent-muted);
    box-shadow: var(--box-shadow-md);
  }

  .tag-link {
    color: var(--color-fg-muted);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
  }

  &:hover .tag-link {
    color: var(--color-fg-accent);
  }

  .tag-count {
    display: inline-block;
    min-inline-size: 1.6em;
    padding: var(--space-xxs) var(--space-sm);
    background-color: var(--color-bg-neutral-muted);
    color: var(--color-fg-neutral);
    font-size: var(--font-size-sm);
    border-radius: var(--border-radius-pill);
    border: var(--border-width-default) solid var(--color-border-neutral-muted);
    text-align: center;
  }
`;
