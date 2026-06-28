import { styled } from "@linaria/react";
import Link from "next/link";

// Exists for the section landmark and its hidden heading, not for styling.
export const ShareSection = styled.section``;

// Fluid gap keeps touch targets apart on small screens without spreading them on large ones.
export const ShareIcons = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.25rem, 0.4vw, 0.5rem);
`;

// Visual-only prefix — aria-hidden since the hidden heading already names the section.
export const ShareLabel = styled.span`
  font-size: 0.875rem;
  color: var(--color-fg-muted);
`;

// One base so the anchor and button variants can't drift apart in their interactive states.
const shareItemBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.25rem, 0.4vw, 0.5rem);
  color: var(--color-fg-muted);
  font-size: 1em;
  text-decoration: none;
  cursor: pointer;
  transition: color 300ms cubic-bezier(0.6, 0, 0.2, 1);

  &:hover,
  &:focus-visible {
    background-color: var(--color-bg-transparent);
    color: var(--color-fg-default);
  }
`;

// An anchor for share targets with a URL so they stay real links.
export const ShareLink = styled(Link)`
  ${shareItemBase}
`;

// A button for actions with no URL, reset to match the links; green gives a copy visible confirmation.
export const ShareButton = styled.button`
  ${shareItemBase}
  background: none;
  border: none;
  font-family: inherit;

  &[data-copied="true"] {
    color: var(--color-fg-success);
  }
`;
