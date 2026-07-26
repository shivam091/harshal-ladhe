/*
  Static per-key layout (x position + width) — only `y` (via getKeySpringTarget) animates.
  Three keys read as a shortcut combo (wide modifier + regular key + wide "Enter"), sitting
  inside the frame drawn in IconKeyboard.tsx.
*/
export const KEY_LAYOUT: { x: number; width: number }[] = [
  { x: 4.5, width: 4.5 },
  { x: 10.5, width: 3 },
  { x: 15, width: 4.5 }
];

// Keys' rest position and how far (in viewBox units) a key sinks when pressed.
const KEY_REST_Y = 11;
const PRESS_OFFSET = 1.25;

/*
  Delay between each key's press/release, left-to-right on press and right-to-left on release —
  reads as a small ripple rather than all three keys moving in lockstep.
*/
const STAGGER_MS = 70;

// Per-key spring target: sunken `y` + its stagger delay, for the given press index and boop state.
export function getKeySpringTarget(index: number, isBooped: boolean): { y: number; delay: number } {
  return {
    y: isBooped ? KEY_REST_Y + PRESS_OFFSET : KEY_REST_Y,
    delay: (isBooped ? index : KEY_LAYOUT.length - 1 - index) * STAGGER_MS
  };
}
