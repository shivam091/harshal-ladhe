import { styled } from "@linaria/react";

/*
  Square submit button — black/white in light mode, amber/black in dark mode.
  overflow: clip hides the arrow icon as it slides off to the right during submit.
*/
export const SubmitBtn = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.25rem;
  height: 2.25rem;
  background: black;
  color: white;
  border: none;
  border-radius: var(--border-radius-4);
  font-size: var(--font-size-sm);
  cursor: pointer;
  flex-shrink: 0;
  transition:
    color var(--color-swap-duration) var(--color-swap-timing-function),
    background var(--color-swap-duration) var(--color-swap-timing-function);
  overflow: hidden;
  overflow: clip;

  &:disabled {
    cursor: not-allowed;
  }

  html[data-theme="dark"] & {
    background: hsl(50deg 100% 50%);
    background: oklch(0.9 0.22 97.52);
    color: black;
  }
`;

// Diagonal clip-path progress fill that sweeps across the button during submission.
export const ProgressIndicator = styled.span`
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
  width: 120%;
  height: 100%;
  clip-path: polygon(
    0% 0%,
    var(--progress) 0%,
    calc(var(--progress) + 20%) 100%,
    0% 100%
  );

  html[data-theme="light"] & {
    background: hsl(200deg 70% 70% / 0.4);
  }

  html[data-theme="dark"] & {
    background: hsl(0deg 0% 100% / 0.8);
  }
`;

// Arrow SVG — centered via position:absolute; slides right on submit, back on error.
export const ArrowIcon = styled.svg`
  position: absolute;
  inset: 0;
  margin: auto;
  transition: transform var(--motion-duration-medium);
`;

// Wrapper for the CSS spinner — animates in after arrow slides out.
export const SpinnerWrapper = styled.span`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: enter-spinner var(--motion-duration-slow) both;
  animation-delay: 200ms;

  @keyframes enter-spinner {
    from {
      opacity: 0;
      transform: scale(0.25);
    }
  }
`;

// Pure-CSS circular spinner used inside the submit button.
export const BtnSpinner = styled.span`
  display: block;
  width: 14px;
  height: 14px;
  border-width: var(--border-width-medium);
  border-style: solid;
  border-color: currentColor;
  border-block-start-color: transparent;
  border-radius: 50%;
  animation: spin-btn var(--motion-duration-extra-slow) linear infinite;

  @keyframes spin-btn {
    to {
      transform: rotate(360deg);
    }
  }
`;
