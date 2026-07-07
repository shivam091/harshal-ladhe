import type { JSX } from "react";
import type { LoaderProps } from "@/interfaces/navigation-progress";
import { Backdrop } from "@/components/NavigationProgress/NavigationProgress.styles";
import { RingsSvg, OuterRing, MiddleRing, InnerRing } from "@/components/NavigationProgress/loaders/RingsLoader/RingsLoader.styles";

/*
 * Triple-ring spinner — the site's original navigation loader. Arc lengths are calculated
 * from each circle's circumference:
 *   Outer  r=34 → C ≈ 213.6 → 3/4 arc: dasharray="160 54"
 *   Middle r=25 → C ≈ 157.1 → 2/3 arc: dasharray="105 52"
 *   Inner  r=16 → C ≈ 100.5 → 1/2 arc: dasharray=" 50 51"
 *
 * Rotation speeds/directions — each ring eases via its own symmetric
 * cubic-bezier (fast through the middle, slow at the ends) with a
 * slightly different steepness/duration, so they read as a related
 * family rather than one identical loop:
 *   Outer  → clockwise,          2.2s, gentlest ease
 *   Middle → counter-clockwise,  2.0s, baseline ease
 *   Inner  → clockwise,          1.8s, sharpest ease
 */
export default function RingsLoader({ backdrop }: LoaderProps): JSX.Element {
  return (
    <>
      {backdrop && <Backdrop />}
      <RingsSvg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <OuterRing cx="40" cy="40" r="34" />
        <MiddleRing cx="40" cy="40" r="25" />
        <InnerRing cx="40" cy="40" r="16" />
      </RingsSvg>
    </>
  );
}

RingsLoader.displayName = "RingsLoader";
