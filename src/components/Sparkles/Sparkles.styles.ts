import { css } from "@linaria/core";
import { styled } from "@linaria/react";

/*
  Outer wrapper class, applied to a plain `<button>` or `<span>` depending on `isToggleable`
  (see Sparkles.tsx — this repo's polymorphic components, like VisuallyHidden, switch the
  rendered tag manually rather than relying on a styled-component's `as` prop).
  `isolation: isolate` flattens the sparkles' randomized z-index (1 or 3) so it only resolves
  against ChildWrapper's z-index of 2 inside this component, instead of leaking out and
  fighting for stacking order with the rest of the page.
*/
export const wrapper = css`
  display: inline-block;
  position: relative;
  color: inherit;
  font: inherit;
  text-shadow:
    0 0 3px var(--color-bg-default),
    1px 1px 1px var(--color-bg-default);
  background: none;
  border: none;
  padding: 0;
  isolation: isolate;

  &[data-toggleable="true"] {
    cursor: pointer;
  }

  &[data-toggleable="false"] {
    cursor: revert;
  }
`;

// Hosts the wrapped text/content above the sparkles (z-index: 2 sits between their randomized 1/3 stacking).
export const ChildWrapper = styled.strong`
  position: relative;
  z-index: 2;
  font-weight: inherit;
`;
