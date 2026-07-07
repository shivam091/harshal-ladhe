import { styled } from "@linaria/react";

export const BurstStage = styled.div`
  position: relative;
  z-index: 1;
  inline-size: 4rem;
  block-size: 4rem;
`;

// Central dot — soft breathing pulse while loading, frozen the instant navigation completes.
export const CoreDot = styled.span`
  position: absolute;
  inset: 0;
  margin: auto;
  inline-size: 1rem;
  block-size: 1rem;
  border-radius: 624.9375rem;
  background: var(--color-fg-accent);
  box-shadow: 0 0 10px 2px hsl(from var(--color-fg-accent) h s l / 0.5);
  animation: core-pulse 1.2s ease-in-out infinite;
  will-change: transform, opacity;

  @keyframes core-pulse {
    0%,
    100% {
      transform: scale(0.85);
      opacity: 0.7;
    }

    50% {
      transform: scale(1.1);
      opacity: 1;
    }
  }

  &[data-state="done"] {
    animation: none;
    transform: scale(1);
    opacity: 1;
  }
`;

/*
  One-shot expanding ring. Unlike CoreDot above (which is always mounted and toggles its
  animation via `data-state`), this only ever renders once navigation completes (see
  BurstLoader.tsx) — mounting fresh guarantees the one-shot animation actually plays, rather
  than relying on an attribute change to (re)trigger `animation` on an element that already
  existed, which risks landing in the same paint as the overlay's own fade-out.
*/
export const PingRing = styled.span`
  position: absolute;
  inset: 0;
  margin: auto;
  inline-size: 16px;
  block-size: 16px;
  border-radius: 50%;
  border: 0.125rem solid var(--color-fg-success);
  animation: ping 550ms cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes ping {
    0% {
      transform: scale(0.6);
      opacity: 0.9;
    }

    100% {
      transform: scale(2.6);
      opacity: 0;
    }
  }
`;

/*
  One radial particle — mounted only on completion, same reasoning as PingRing above.
  Centring via top/left 50% + a negative margin (half its own size) puts the dot's own centre
  exactly on BurstStage's centre — which matters because `rotate()` pivots around an element's
  own centre by default, so rotating from here means `translateY()` afterwards moves it
  outward along a spoke at `--angle`, giving the radial burst.
*/
export const Particle = styled.span`
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  inline-size: 5px;
  block-size: 5px;
  margin-block-start: -2.5px;
  margin-inline-start: -2.5px;
  border-radius: 624.9375rem;
  background: var(--particle-color, var(--color-fg-attention));
  animation: burst-fly 550ms cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes burst-fly {
    0% {
      transform: rotate(var(--angle, 0deg)) translateY(0) scale(1);
      opacity: 1;
    }

    100% {
      transform: rotate(var(--angle, 0deg)) translateY(-28px) scale(0.4);
      opacity: 0;
    }
  }
`;
