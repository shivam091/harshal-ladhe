import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

// Sticky copy button that trails the viewport as tall code blocks scroll; invisible until the parent is hovered or focused.
export const Btn = styled.button`
  /*
    Sticky so the button follows the viewport as tall code blocks scroll,
    but stops at the bottom edge of the code block container.
  */
  position: sticky;
  inset-block-start: calc(5rem + 8px);
  z-index: 2;
  // Float to the right without taking horizontal space from the code
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline-start: auto;
  margin-inline-end: 0.5rem;
  margin-block-start: 0.5rem;
  margin-block-end: 0.5rem;
  inline-size: 2rem;
  block-size: 2rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border-muted);
  background: var(--color-bg-control);
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 250ms ease,
    background 150ms ease,
    color 150ms ease,
    transform 150ms ease;
  transition-delay: 800ms;
  will-change: transform;

  &:hover {
    background: var(--color-bg-control-hover);
    color: var(--color-fg-default);
  }

  &:active {
    transform: scale(0.92);
  }
`;

// Outer spring wrapper — receives the scale boop transform on hover.
export const IconOuterWrapper = styled(animated.span)`
  display: block;
  will-change: transform;
`;

// Inner spring wrapper — receives the tilt rotation on click, with a top-biased pivot so the icon tips rather than spins.
export const IconWrapper = styled(animated.span)`
  display: block;
  position: relative;
  inline-size: 1.5rem;
  block-size: 1.5rem;
  will-change: transform;
  transform-origin: 50% 20%;

  transition: color 300ms ease;

  // Direct child only — leaves CheckIcon inside CheckMark at its own explicit size
  > svg {
    display: block;
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    transition: opacity 300ms ease, transform 350ms ease;
  }
`;

// Absolutely-positioned overlay that fades and scales the checkmark SVG into view on successful copy.
export const CheckMark = styled.span`
  position: absolute;
  // Matches the clipboard body bounds in a 14px icon (4/24×14 ≈ 2px, 2/24×14 ≈ 1px)
  inset-block: 4px 1px;
  inset-inline: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  color: var(--color-fg-success);
  transition:
    opacity 500ms,
    transform 650ms;
  transition-delay: 200ms;
  will-change: opacity, transform;
`;

