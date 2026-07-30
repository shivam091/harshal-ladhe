import type { JSX } from "react";
import { memo } from "react";

// Decorative shine/shadow strokes layered over the heart artwork.
function Effects(): JSX.Element {
  return (
    <>
      <g>
        <path
          d="M53.5 18.5L47 5C47 5 53.5 31.9722 24.5 36C-4.5 40.0278 1 1.5 1 1.5L-6.5 25L8.00002 44.5L15.5 52L39 49L53.5 18.5Z"
          fill="black"
          fillOpacity="0.1"
        />
        <path
          d="M6.14471 8.44525C6.64924 7.12038 7.41962 5.99208 8.36394 5.15003C9.30652 4.30953 10.3901 3.78182 11.5089 3.58622"
          stroke="white"
          strokeOpacity="0.45"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M31.7084 5.95975C32.7822 4.70067 34.1021 3.81419 35.484 3.37609"
          stroke="white"
          strokeOpacity="0.45"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </>
  );
}

Effects.displayName = "Effects";

// Static markup with no props — memoised so cursor-driven parent re-renders never touch it.
export default memo(Effects);
