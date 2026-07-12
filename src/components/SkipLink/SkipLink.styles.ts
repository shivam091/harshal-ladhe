import { styled } from "@linaria/react";

// Hidden until focused so it doesn't clutter the page, yet appears the moment a keyboard user tabs in.
export const SkipLinkWrapper = styled.div`
  position: fixed;
  inset-block-start: 0.5rem;
  inset-inline-start: 0.5rem;
  z-index: 9999;
  inline-size: fit-content;
  // Offset by the top gap too, so no sliver peeks below the viewport edge while hidden.
  translate: 0 calc(-100% - 0.5rem);
  transition: translate 300ms cubic-bezier(0.16, 1, 0.3, 1);

  /*
    Error pages cover the screen with their own overlay, so there's no main content to skip to.
    No :global() needed — Linaria only scopes class names, not element/attribute selectors.
  */
  body[data-error-page] & {
    display: none;
  }

  &:focus-within {
    translate: 0 0;
  }
`;
