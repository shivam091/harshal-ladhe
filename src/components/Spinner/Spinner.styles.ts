import { styled } from "@linaria/react";

// Rotating wrapper around the Loader icon; --duration/--size are set inline per-instance by Spinner.tsx. Reuses the site-wide `spin` keyframe (src/styles/abstracts/animations/_spin.scss).
export const Wrapper = styled.span`
  display: block;
  color: inherit;
  opacity: 0.75;
  transform-origin: center center;
  line-height: 0;

  @media (prefers-reduced-motion: no-preference) {
    animation: spin var(--duration) linear infinite;
  }

  svg {
    display: block !important;
    height: var(--size);
  }
`;
