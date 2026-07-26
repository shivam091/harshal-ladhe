import { JSX } from "react";
import type { DotProgressBarProps } from "@/interfaces/dot-progress-bar";
import { DotsWrapper, Dot } from "@/components/DotProgressBar/DotProgressBar.styles";

/*
  Row of dots that fill in one-by-one as `value` climbs from 0 to 1 — used by ResetButton to show
  press-and-hold progress toward triggering a reset.
*/
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
