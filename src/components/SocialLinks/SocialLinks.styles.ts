import { styled } from "@linaria/react";

// Horizontal flex list of social links with wrapping on narrow viewports.
export const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin-block: clamp(0.75rem, 1vw, 1rem);
`;

// Pill-shaped social anchor — bordered muted background, softens to default on hover.
export const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid var(--color-border-muted);
  background: var(--color-bg-muted);
  color: var(--color-fg-muted);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 150ms ease, color 150ms ease, background 150ms ease;

  &:hover {
    border-color: var(--color-border-default);
    color: var(--color-fg-default);
    background: var(--color-bg-neutral-muted);
    text-decoration: none;
  }
`;
