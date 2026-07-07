import { styled } from "@linaria/react";

export const BounceRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  block-size: 32px;
`;

/*
  Squash-and-stretch bounce, staggered per dot. `animation: none` (rather than
  animation-play-state: paused) on completion is required alongside the pop below: a paused
  animation still owns the `transform` property and would otherwise mute the scale change.
*/
const Dot = styled.span`
  inline-size: 12px;
  block-size: 12px;
  border-radius: 624.9375rem;
  animation: bounce 0.9s ease-in-out infinite;
  transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0) scaleX(1.15) scaleY(0.85);
    }

    50% {
      transform: translateY(-16px) scaleX(0.9) scaleY(1.15);
    }
  }

  &[data-state="done"] {
    animation: none;
    transform: scale(1.3);
  }
`;

export const FirstDot = styled(Dot)`
  background: var(--color-fg-attention);
  animation-delay: 0s;
`;

export const SecondDot = styled(Dot)`
  background: var(--color-fg-success);
  animation-delay: 0.12s;
`;

export const ThirdDot = styled(Dot)`
  background: var(--color-fg-accent);
  animation-delay: 0.24s;
`;
