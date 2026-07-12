import { styled } from "@linaria/react";

// Off-screen by default; slides into view on :focus-within so keyboard users see it.
export const SkipLinkWrapper = styled.div`
  position: fixed;
  inset-block-start: var(--space-sm);
  inset-inline-start: var(--space-sm);
  z-index: 9999;
  inline-size: fit-content;
  /*
    Shift up by own height + top gap so it sits just above the viewport edge.
    On :focus-within the translate resets to 0 and the button slides into view.
  */
  translate: 0 calc(-100% - var(--space-sm));
  transition: translate var(--motion-duration-medium) var(--motion-easing-entrance);

  /*
    Error/404 pages have their own full-screen overlay — hide the skip link there.
    Plain element/attribute selector — no :global() needed, only class names get scoped.
  */
  body[data-error-page] & {
    display: none;
  }

  &:focus-within {
    translate: 0 0;
  }
`;
