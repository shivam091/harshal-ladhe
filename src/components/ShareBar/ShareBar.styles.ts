import { styled } from "@linaria/react";
import Link from "next/link";

// Wraps the visually-hidden heading + share icons; no visual treatment of its own.
export const ShareSection = styled.section``;

// Horizontal row of share actions — platform links and the copy-link button.
export const ShareIcons = styled.div`
  display: flex;
  align-items: center;
  gap: var(--fluid-space-xs);
`;

// Visible "Share:" prefix; hidden from assistive tech via aria-hidden on the element.
export const ShareLabel = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-fg-muted);
`;

/*
  Shared CSS base for ShareLink and ShareButton — keeps interactive states consistent
  across the anchor and button variants without duplicating declarations.
*/
const shareItemBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--fluid-space-xs);
  color: var(--color-fg-muted);
  font-size: 1em;
  text-decoration: none;
  cursor: pointer;
  transition: color var(--motion-duration-medium) var(--motion-easing-smooth);

  &:hover,
  &:focus-visible {
    background-color: var(--color-bg-transparent);
    color: var(--color-fg-default);
  }
`;

// Anchor variant — used for platform share links that open in a popup.
export const ShareLink = styled(Link)`
  ${shareItemBase}
`;

/*
  Button variant — used for actions without an href, such as CopyLink.
  Resets browser button styles, then turns green while the copied state is active.
*/
export const ShareButton = styled.button`
  ${shareItemBase}
  background: none;
  border: none;
  font-family: inherit;

  &[data-copied="true"] {
    color: var(--color-fg-success);
  }
`;
