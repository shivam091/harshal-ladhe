import { styled } from "@linaria/react";

// Speed and size come in as custom properties so one class serves every instance; spinning is skipped for reduced-motion users.
export const Wrapper = styled.span`
  display: block;
  color: inherit;
  opacity: 0.75;
  transform-origin: center center;
  line-height: 0;

  @media (prefers-reduced-motion: no-preference) {
    animation: spin var(--duration) linear infinite;
    will-change: transform;
  }

  svg {
    display: block !important;
    block-size: var(--size);
  }
`;
