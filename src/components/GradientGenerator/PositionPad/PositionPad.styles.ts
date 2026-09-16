import { styled } from "@linaria/react";

// Vertical label+control stack — PositionPad's own copy of the same field-wrapper idiom AngleDial defines, since each geometry control owns its own glass chrome independently.
export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

// Small-caps label above the pad.
export const FieldLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

/*
  Square glass plane standing in for the gradient's own coordinate space (0,0 top-left to 100,100
  bottom-right) — this tool's second tactile control (alongside AngleDial), for dragging a radial or
  conic gradient's center point directly rather than typing two separate x/y numbers. Also the
  focusable/keyboard-nudgeable target, matching AngleDial's "the whole surface is the control" approach.
*/
export const PadStage = styled.div`
  position: relative;
  inline-size: clamp(9rem, 26vw, 11rem);
  aspect-ratio: 1 / 1;
  border-radius: 0.875rem;
  background: color-mix(in srgb, var(--color-bg-default) 60%, transparent);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 55%, transparent);
  box-shadow: var(--box-shadow-sm);
  cursor: crosshair;
  touch-action: none;
  user-select: none;
  overflow: hidden;

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus);
    outline-offset: 0.1875rem;
  }
`;

// Horizontal guide line tracking the handle's current y — always visible so the handle's position reads clearly against any gradient. `top` set inline from PositionPad.tsx.
export const PadGuideX = styled.div`
  position: absolute;
  inset-inline: 0;
  block-size: 0;
  border-block-start: 0.0625rem dashed color-mix(in srgb, var(--color-fg-accent) 45%, transparent);
  pointer-events: none;
`;

// Vertical guide line tracking the handle's current x. `left` set inline from PositionPad.tsx.
export const PadGuideY = styled.div`
  position: absolute;
  inset-block: 0;
  inline-size: 0;
  border-inline-start: 0.0625rem dashed color-mix(in srgb, var(--color-fg-accent) 45%, transparent);
  pointer-events: none;
`;

// The glowing crosshair handle sitting at the guide lines' intersection — visual only, PadStage itself is the actual drag/focus target.
export const PadHandle = styled.div`
  position: absolute;
  inline-size: 0.875rem;
  block-size: 0.875rem;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: var(--color-fg-accent);
  border: 0.125rem solid var(--color-bg-default);
  box-shadow: 0 0 0.5rem 0.0625rem color-mix(in srgb, var(--color-fg-accent) 75%, transparent);
  pointer-events: none;
`;
