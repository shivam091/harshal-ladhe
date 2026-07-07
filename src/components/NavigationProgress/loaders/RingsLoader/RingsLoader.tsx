import type { JSX } from "react";
import type { LoaderProps } from "@/components/NavigationProgress/NavigationProgress.types";
import { Backdrop } from "@/components/NavigationProgress/NavigationProgress.styles";
import { RingsSvg, OuterRing, MiddleRing, InnerRing } from "@/components/NavigationProgress/loaders/RingsLoader/RingsLoader.styles";

// pathLength="100" lets the dash arrays be written as percentages, so resizing a ring never means redoing circumference maths.
export default function RingsLoader({ backdrop }: LoaderProps): JSX.Element {
  return (
    <>
      {backdrop && <Backdrop />}
      <RingsSvg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <OuterRing cx="40" cy="40" r="34" pathLength="100" />
        <MiddleRing cx="40" cy="40" r="25" pathLength="100" />
        <InnerRing cx="40" cy="40" r="16" pathLength="100" />
      </RingsSvg>
    </>
  );
}

RingsLoader.displayName = "RingsLoader";
