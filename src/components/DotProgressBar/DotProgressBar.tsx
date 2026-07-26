import type { JSX } from "react";
import type { DotProgressBarProps } from "@/components/DotProgressBar/DotProgressBar.types";
import { DotsWrapper, Dot } from "@/components/DotProgressBar/DotProgressBar.styles";

// Fills dot by dot as `value` climbs, so progress toward a threshold reads at a glance.
export default function DotProgressBar({
  value,
  numOfDots,
  dotSize = 4,
  dotColor = "currentColor"
}: DotProgressBarProps): JSX.Element {
  return (
    <>
      <DotsWrapper>
        {Array.from({ length: numOfDots }, (_, index) => {
          const fill = Math.min(Math.max(value * numOfDots - index, 0), 1);

          return (
            <Dot
              key={index}
              style={{
                inlineSize: dotSize,
                blockSize: dotSize,
                backgroundColor: dotColor,
                opacity: fill,
                transform: `scale(${fill})`
              }}
            />
          );
        })}
      </DotsWrapper>
    </>
  );
}

DotProgressBar.displayName = "DotProgressBar";
