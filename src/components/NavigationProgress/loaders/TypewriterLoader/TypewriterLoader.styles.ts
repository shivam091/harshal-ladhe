import { styled } from "@linaria/react";
import { Backdrop } from "@/components/NavigationProgress/NavigationProgress.styles";

// A pill rather than Backdrop's circle, since text needs horizontal room.
export const TypewriterBackdrop = styled(Backdrop)`
  inline-size: 240px;
  block-size: 56px;
  border-radius: 28px;
`;

// Sized to match the pill so the text stays centred inside it.
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
  A fixed, generous step count avoids `steps(var(--chars))`, which is riskier across engines;
  re-keyed per phrase so each one restarts the animation from scratch.
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
