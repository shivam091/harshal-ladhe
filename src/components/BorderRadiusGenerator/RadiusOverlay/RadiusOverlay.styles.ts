import { styled } from "@linaria/react";

// Transparent hit-area layered exactly over the clay lump — sized to match it via `inset: 0` from its parent ClayLump, not the worktable, so every handle's 0-100% drag space always matches the lump's own bounds regardless of its current size.
export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  touch-action: none;
`;

/*
  One draggable "pinch point" sitting on a corner — styled like a fingertip has just pressed into
  the clay there: a small dimpled disc (an off-center highlight plus a darker rim, rather than a
  flat dot) that visibly deepens and grows slightly under the pointer while being dragged, the same
  tactile feedback a real pinch would give. `transform-origin` stays centered on the handle's own
  anchor point (translate(-50%, -50%)) so the scale-up on `data-active` grows outward from the exact
  spot being pinched rather than drifting.
*/
export const Handle = styled.button`
  position: absolute;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  transform: translate(-50%, -50%) scale(1);
  padding: 0;
  border: 0.125rem solid var(--color-bg-default);
  border-radius: 50%;
  background: radial-gradient(circle at 36% 32%, color-mix(in srgb, white 55%, var(--color-bg-accent-emphasis)), var(--color-bg-accent-emphasis) 70%);
  box-shadow: 0 0.125rem 0.25rem color-mix(in srgb, var(--color-fg-default) 32%, transparent), inset 0 -0.0625rem 0.125rem color-mix(in srgb, var(--color-fg-default) 30%, transparent);
  cursor: grab;
  transition: transform 150ms ease, box-shadow 150ms ease;

  &[data-selected="true"] {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  &[data-active="true"] {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(1.35);
    box-shadow: 0 0.25rem 0.5rem color-mix(in srgb, var(--color-fg-default) 40%, transparent), inset 0 -0.0625rem 0.1875rem color-mix(in srgb, var(--color-fg-default) 35%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: box-shadow 150ms ease;

    &[data-active="true"] {
      transform: translate(-50%, -50%);
    }
  }
`;
