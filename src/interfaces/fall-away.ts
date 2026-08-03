import type { ReactNode } from "react";

/*
  Props for FallAway — fades and translates its children down (with rotation) when `when` becomes true,
  staggered by `delay`.
*/
export interface FallAwayProps {
  // Whether to trigger the fall-away — false renders children at rest.
  when: boolean;
  // Vertical distance (px) to translate down while falling away.
  distance: number;
  // Rotation (degrees) applied while falling away.
  rotation: number;
  // Transition delay (ms) — stagger multiple FallAway instances by varying this.
  delay: number;
  // Content to fade and translate.
  children: ReactNode;
}
