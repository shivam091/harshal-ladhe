import { styled } from "@linaria/react";
import { Backdrop } from "@/components/NavigationProgress/NavigationProgress.styles";

// Wider pill (rather than the shared Backdrop's circle) since text needs horizontal room —
// everything but size/shape is inherited from Backdrop.
export const TypewriterBackdrop = styled(Backdrop)`
  inline-size: 240px;
  block-size: 56px;
  border-radius: 28px;
`;

export const TypewriterWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 240px;
  block-size: 56px;
  padding-inline: 0.75rem;
`;

/*
  Classic typewriter reveal: `inline-size` animates from 0 up to the phrase's own character
  count (via the `--chars` custom property set inline per phrase in TypewriterLoader.tsx),
  clipped by `overflow: hidden`, with a blinking right border standing in as the caret. A
  fixed, generous step count (rather than one tied to `--chars`, which would need
  `steps(var(--chars))` — riskier across engines) covers phrases of any length; a couple of
  extra empty steps at the end just means the last letters resolve a beat sooner, which reads
  fine at this speed. Re-keyed per phrase (see TypewriterLoader.tsx) so the animation restarts
  from scratch on each change.
*/
export const TypewriterText = styled.span`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  max-inline-size: 100%;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-fg-default);
  border-inline-end: 2px solid var(--color-fg-accent);
  animation:
    typing 1.6s steps(30, end) forwards,
    caret-blink 0.8s step-end infinite;

  @keyframes typing {
    from {
      inline-size: 0;
    }
      
    to {
      inline-size: calc(var(--chars, 20) * 1ch);
    }
  }

  @keyframes caret-blink {
    50% {
      border-inline-end-color: transparent;
    }
  }

  &[data-state="done"] {
    animation: none;
    inline-size: calc(var(--chars, 20) * 1ch);
    color: var(--color-fg-success);
    font-weight: 600;
    border-inline-end-color: var(--color-fg-success);
  }
`;
