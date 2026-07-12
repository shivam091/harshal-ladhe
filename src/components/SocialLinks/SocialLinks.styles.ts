import { styled } from "@linaria/react";

// Horizontal flex list of social links with wrapping on narrow viewports.
export const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  list-style: none;
  padding: 0;
  margin-block: var(--fluid-space-md);
`;

// Pill-shaped social anchor — bordered muted background, softens to default on hover.
export const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border-radius: 9999px;
  border: 1px solid var(--color-border-muted);
  background: var(--color-bg-muted);
  color: var(--color-fg-muted);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: border-color 150ms ease, color 150ms ease, background 150ms ease;

  &:hover {
    border-color: var(--color-border-default);
    color: var(--color-fg-default);
    background: var(--color-bg-subtle);
    text-decoration: none;
  }
`;
