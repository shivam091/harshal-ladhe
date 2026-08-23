import { styled } from "@linaria/react";

/*
  Unstyled button wrapping the SVG — hovering/focusing it triggers the stretch, so it needs to be
  a real, keyboard-reachable control.
*/
export const StretchButton = styled.button`
  display: block;
  border: none;
  background: none;
  padding: var(--space-none);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  margin-block: var(--space-lg);
  inline-size: fit-content;
  border-radius: var(--border-radius-md);

  &:focus-visible {
    outline: 2px solid var(--color-fg-accent);
    outline-offset: 4px;
  }
`;

// Root SVG — overflow visible so stretched limbs aren't clipped at the resting viewBox bounds.
export const Svg = styled.svg`
  display: block;
  overflow: visible;
`;
