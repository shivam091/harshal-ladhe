import type { JSX } from "react";
import type { FallAwayProps } from "@/components/FallAway/FallAway.types";

// Lets finished UI (e.g. a form's fields on success) drop out of view playfully instead of just vanishing.
export default function FallAway({ when, distance, rotation, delay, children }: FallAwayProps): JSX.Element {
  return (
    <>
      <span
        style={{
          display: "block",
          transition: `opacity 400ms ${delay}ms, transform 400ms ${delay}ms`,
          opacity: when ? 0 : 1,
          transform: when ? `translateY(${distance}px) rotate(${rotation}deg)` : "none",
          pointerEvents: when ? "none" : undefined
        }}
      >
        {children}
      </span>
    </>
  );
}

FallAway.displayName = "FallAway";
