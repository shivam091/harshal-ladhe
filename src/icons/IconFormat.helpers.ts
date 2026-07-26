import type { IconToggleStatus } from "@/hooks/use-toggle-icon-status";
import { random } from "@/utils/random";

// One entry per sparkle in a burst: its flight (translate/rotate/scale, under a snappy physics
// spring) and its fade (a plain delayed opacity tween) run on independent timings, so the three
// sparkles peel off and fade out staggered rather than in lockstep.
export interface SparkleSpec {
  translateX: number;
  translateY: number;
  rotation: number;
  scale: number;
  tension: number;
  friction: number;
  transformDelay: number;
  fadeDelay: number;
  fadeDuration: number;
}

// Builds three sparkles with subtle randomised variation, so repeated format clicks don't look identical.
export function getSparkleSpecs(): SparkleSpec[] {
  return [
    {
      translateX: random(4, 20),
      translateY: random(-10, 0),
      rotation: random(-90, -220),
      scale: random(1.25, 1.75, { rounded: false }),
      tension: 200,
      friction: 40,
      transformDelay: 0,
      fadeDelay: 350,
      fadeDuration: 900
    },
    {
      translateX: random(4, 8),
      translateY: random(9, 20),
      rotation: random(-200, -250),
      scale: random(1, 1.5, { rounded: false }),
      tension: 80,
      friction: 14,
      transformDelay: 50,
      fadeDelay: 500,
      fadeDuration: 1000
    },
    {
      translateX: random(-15, -4),
      translateY: random(-12, 0),
      rotation: random(-90, -220),
      scale: random(1.25, 1.75, { rounded: false }),
      tension: 100,
      friction: 20,
      transformDelay: 140,
      fadeDelay: 700,
      fadeDuration: 1600
    }
  ];
}

// Target wand rotation in degrees for a given interaction status — a boop nudges it briefly, a press swings it further.
export function getWandRotation(status: IconToggleStatus): number {
  if (status === "booped") return -35;
  if (status === "pressed") return -65;
  return -45;
}
