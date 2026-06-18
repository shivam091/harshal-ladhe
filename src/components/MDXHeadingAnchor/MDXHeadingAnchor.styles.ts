import { styled } from "@linaria/react";

// Hash anchor link — hidden by default, revealed when the parent HeadingWrapper is hovered.
export const AnchorLink = styled.a`
  display: inline-block;
  vertical-align: baseline;
  margin-inline-start: 0.35em;
  white-space: nowrap;

  opacity: 0;
  color: var(--color-fg-muted);
  text-decoration: none;
  transition: opacity 150ms ease, color 150ms ease;

  &:hover {
    color: var(--color-fg-default);
  }

  /* opacity: 0 would otherwise hide the keyboard focus ring along with the link itself. */
  &:focus-visible {
    opacity: 1;
  }
`;

// Inline flex wrapper that keeps the anchor icon on the same line as the heading text.
export const HeadingWrapper = styled.span`
  display: inline;

  &:hover ${AnchorLink} {
    opacity: 1;
  }
`;
