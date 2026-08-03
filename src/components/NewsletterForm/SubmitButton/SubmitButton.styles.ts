import { styled } from "@linaria/react";
import { amberAccentCss } from "@/components/common.styles";

/*
  Shares Button's boxed-icon amber surface so both read as one accent; overflow: clip hides the
  arrow as it slides off during submit.
*/
export const SubmitBtn = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  flex-shrink: 0;
  overflow: hidden;
  overflow: clip;
  ${amberAccentCss}

  &:disabled {
    cursor: not-allowed;
  }
`;

// Diagonal clip-path progress fill that sweeps across the button during submission.
export const ProgressIndicator = styled.span`
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
  inline-size: 120%;
  block-size: 100%;
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

// Absolutely centred so it can slide out of the clipped button on submit and back on error.
export const ArrowIconWrapper = styled.span`
  position: absolute;
  inset: 0;
  margin: auto;
  display: inline-flex;
  inline-size: fit-content;
  block-size: fit-content;
  transition: transform 300ms;
`;

// Delayed entrance so the spinner appears only once the arrow has slid out.
export const SpinnerWrapper = styled.span`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: enter-spinner 500ms both;
  animation-delay: 200ms;

  @keyframes enter-spinner {
    from {
      opacity: 0;
      transform: scale(0.25);
    }
  }
`;

// Pure CSS in currentColor, so it matches the button text without shipping an asset.
export const BtnSpinner = styled.span`
  display: block;
  inline-size: 14px;
  block-size: 14px;
  border-width: 0.125rem;
  border-style: solid;
  border-color: currentColor;
  border-block-start-color: transparent;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
  will-change: transform;
`;
