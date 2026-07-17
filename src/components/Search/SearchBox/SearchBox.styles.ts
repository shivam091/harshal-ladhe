import { css } from "@linaria/core";
import { styled } from "@linaria/react";

// Row pairing the search form with the mobile-only dismiss button.
export const Wrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

// The search form itself — relative positioning anchors the icon + clear button inside it.
export const Form = styled.form`
  --input-height: 2.5rem;
  flex: 1;
  position: relative;
  display: flex;
  animation: fade-in 500ms both;
  animation-delay: 200ms;

  &::after {
    content: "";
    position: absolute;
    inset-inline: 0;
    inset-block-end: -3px;
    block-size: 3px;
    background-color: var(--color-bg-neutral-emphasis);
    border-radius: 50rem;
  }

  &:focus-within::after {
    background-color: var(--color-bg-accent-emphasis);
  }
`;

// Search icon pinned to the left edge of the input, purely decorative.
export const IconSearchWrapper = styled.div`
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  display: grid;
  place-content: center;
  padding-inline-start: 0.5rem;
  color: var(--color-fg-muted);
  pointer-events: none;
  animation: fade-in 500ms both;
  animation-delay: 300ms;
`;

// The actual text input — transparent background so it blends into the modal's own surface.
export const Input = styled.input`
  flex: 1;
  block-size: var(--input-height);
  border: none;
  border-radius: 0.1875rem;
  padding-inline: var(--input-height);
  font-size: 1rem;
  background: transparent;
  color: var(--color-fg-muted);
  outline: none;

  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration {
    appearance: none;
  }
`;

/*
  Circular clear ("x") button pinned to the right edge of the input; fades in once there's
  text to clear. No colour/hover treatment of its own — matches reference, which relies
  purely on IconTrash's own boop animation for affordance. Inset focus ring (negative
  offset) so it sits inside the circular hit target instead of around it.

  This project has no global <button> reset (each button-styled component supplies its own,
  e.g. headerActionClass for the header's action buttons/IconDismiss) — background/border/
  padding/font/cursor are reset explicitly here so it doesn't fall back to the browser's
  default button chrome the way headerActionClass-driven buttons never do.
*/
export const ClearButton = styled.button`
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  display: grid;
  place-content: center;
  inline-size: var(--input-height);
  block-size: var(--input-height);
  border-radius: 50rem;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: opacity 500ms;
  outline-color: var(--color-outline-focus);
  outline-offset: calc(0.25rem * -1);
`;

/*
  Positioning-only override for the mobile dismiss button — combined with headerActionClass
  (imported below) plus the `data-mobile-only` attribute (same convention the header's own
  hamburger uses to show up only under 48rem), so this button is pixel-identical, chrome and
  all, to the header's own action buttons. Applied to the shared DismissButton component
  (see SearchBox.tsx).
*/
export const mobileCloseButtonClass = css`
  align-self: center;
`;

// Re-exported so SearchBox.tsx can combine it with mobileCloseButtonClass above.
export { headerActionClass } from "@/components/SiteHeader/SiteHeaderClient.styles";
