import { styled } from "@linaria/react";

/*
  Full-width rail fixed to top of viewport. Fades out once navigation completes — the 150ms transition delay
  lets the bar visually reach 100% first.
*/
export const Track = styled.div`
  position: fixed;
  inset-inline: 0;
  inset-block-start: 0;
  block-size: 3px;
  z-index: 9999;
  pointer-events: none;
  opacity: var(--opacity-full);
  transition: opacity 350ms ease 150ms;

  &[data-state="done"] {
    opacity: var(--opacity-none);
  }
`;

/*
  Gradient fill bar — inline-size is driven by inline style from progress state; the gradient itself
  slides via its own local keyframe (previously the shared global `bg-slide`, now component-scoped —
  see Hero.styles.ts for the heading's own copy of the same idea).
*/
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
  Centred spinner overlay — appears only after the component's own delay so fast
  navigations never flash it. Once visible, it also spans the full viewport as a
  click-blocker (`pointer-events: auto` + `cursor: progress`) so a stray click on
  a link mid-navigation can't fire off a second, conflicting navigation.
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
  opacity: var(--opacity-none);
  transition: opacity 220ms ease;

  &[data-visible="true"] {
    opacity: var(--opacity-full);
    pointer-events: auto;
    cursor: progress;
  }
`;

// Frosted circular pill behind the spinner so its rings stay readable against any page background.
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

// SVG wrapper for the triple-ring spinner — glow lifted from the bar's accent colour.
export const SpinnerSvg = styled.svg`
  position: relative;
  z-index: 1;
  inline-size: 80px;
  block-size: 80px;
  filter: drop-shadow(0 0 6px hsl(from var(--color-fg-accent) h s l / 0.45));
`;

/*
  Shared geometry for every ring — a plain SVG circle rotated around its own
  centre (cx="40" cy="40" in the SVG). transform-box: fill-box makes
  transform-origin: center work correctly for SVG shapes. Each variant below
  only adds its colour, arc length, and rotation.
*/
const Ring = styled.circle`
  transform-box: fill-box;
  transform-origin: center;
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
`;

// Outer ring — attention colour, 3/4 arc, clockwise, slow. Uses the global `spin` keyframe.
export const OuterRing = styled(Ring)`
  stroke: var(--color-fg-attention);
  stroke-dasharray: 160 54;
  animation: spin 2.8s linear infinite;
`;

/*
  Middle ring — success colour, 2/3 arc, counter-clockwise, medium. `spin-ccw` is scoped here
  since no global reverse-spin keyframe exists.
*/
export const MiddleRing = styled(Ring)`
  stroke: var(--color-fg-success);
  stroke-dasharray: 105 52;
  animation: spin 2s ease-in-out infinite reverse;
`;

// Inner ring — accent colour, 1/2 arc, clockwise, fast. Uses the global `spin` keyframe.
export const InnerRing = styled(Ring)`
  stroke: var(--color-fg-accent);
  stroke-dasharray: 50 51;
  animation: spin 1.2s linear infinite;
`;
