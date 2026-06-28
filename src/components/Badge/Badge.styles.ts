import { styled } from "@linaria/react";

// Pill badge used for tags, categories, and other small labels. Based on an
// anchor so it can render as a link, or as a plain <span> via the `as` prop.
export const BadgeRoot = styled.a`
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--fluid-font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  background-color: var(--color-bg-muted);
  color: var(--color-fg-muted);
  border: var(--border-width-default) solid var(--color-border-muted);
  border-radius: var(--border-radius-default);
  text-decoration: none;
  transition-property: background-color, border-color, color, box-shadow;
  transition-duration: var(--motion-duration-fast);
  transition-timing-function: var(--motion-easing-ease);

  /* Interactive affordance only when the badge is a link — matches the
     accent border + shadow lift used on post/series/goodie/snippet cards. */
  a&:hover {
    color: var(--color-fg-accent);
    border-color: var(--color-border-accent-muted);
    box-shadow: var(--box-shadow-sm);
    text-decoration: none;
  }
`;
