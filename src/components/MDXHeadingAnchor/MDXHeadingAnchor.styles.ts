import { styled } from "@linaria/react";

// Hash anchor link — hidden by default, revealed when the parent HeadingWrapper is hovered.
export const AnchorLink = styled.a`
  margin-inline-start: 0.4em;
  opacity: var(--opacity-none);
  text-decoration: none;
  color: var(--color-fg-muted);
  transition: opacity 150ms ease;

  &:hover {
    color: var(--color-fg-default);
  }

  /* opacity: 0 would otherwise hide the keyboard focus ring along with the link itself. */
  &:focus-visible {
    opacity: var(--opacity-full);
  }
`;

// Inline flex wrapper that keeps the anchor icon on the same line as the heading text.
export const HeadingWrapper = styled.span`
  display: inline-flex;
  align-items: center;

  &:hover ${AnchorLink} {
    opacity: var(--opacity-full);
  }
`;
