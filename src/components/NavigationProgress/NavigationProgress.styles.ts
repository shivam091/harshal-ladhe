import { styled } from "@linaria/react";

// The fade waits 150ms so the bar visibly reaches 100% before disappearing.
export const Track = styled.div`
  position: fixed;
  inset-inline: 0;
  inset-block-start: 0;
  block-size: 3px;
  z-index: 9999;
  pointer-events: none;
  opacity: 1;
  transition: opacity 350ms ease 150ms;

  &[data-state="done"] {
    opacity: 0;
  }
`;

// Width comes from inline style because progress changes every tick; the gradient slide stays local to the component.
export const Bar = styled.div`
  position: absolute;
  inset-inline-start: 0;
  inset-block: 0;
  block-size: 100%;
  background: linear-gradient(
    90deg,
    var(--color-fg-attention),
    var(--color-fg-success),
    var(--color-fg-accent),
    var(--color-fg-attention)
  );
  background-size: 200% 100%;
  animation: progress-bg-slide 1.4s linear infinite;
  transition: inline-size 220ms cubic-bezier(0.4, 0, 0.2, 1);

  // Slides the gradient leftward across the bar, looping seamlessly since background-size is 200%.
  @keyframes progress-bg-slide {
    to {
      background-position: -200% center;
    }
  }
  border-start-start-radius: 0;
  border-start-end-radius: 2px;
  border-end-end-radius: 2px;
  border-end-start-radius: 0;
  box-shadow:
    0 0 6px 0 var(--color-fg-accent),
    0 0 14px 0 hsl(from var(--color-fg-accent) h s l / 0.4);
`;

// Leading glow orb riding at the head of the bar.
export const Orb = styled.span`
  position: absolute;
  inset-block-start: 50%;
  inset-inline-end: -4px;
  inline-size: 10px;
  block-size: 10px;
  border-radius: 50%;
  background: var(--color-fg-accent);
  transform: translateY(-50%);
  box-shadow:
    0 0 6px 2px var(--color-fg-accent),
    0 0 14px 4px hsl(from var(--color-fg-accent) h s l / 0.5);
`;

/*
  Blocks clicks while visible so a stray click mid-navigation can't start a second, conflicting
  navigation; the visual itself is left to the active loader.
*/
export const Overlay = styled.div`
  position: fixed;
  inset-block: 0;
  inset-inline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  pointer-events: none;
  opacity: 0;
  transition: opacity 220ms ease;
  will-change: opacity;

  &[data-visible="true"] {
    opacity: 1;
    pointer-events: auto;
    cursor: progress;
  }
`;

// Frosted pill keeps a loader readable against any page background.
export const Backdrop = styled.span`
  position: absolute;
  inline-size: 110px;
  block-size: 110px;
  border-radius: 50%;
  background: hsl(from var(--color-bg-default) h s l / 0.72);
  backdrop-filter: blur(14px) saturate(1.3);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
  border: 1px solid hsl(from var(--color-border-default) h s l / 0.25);
`;
