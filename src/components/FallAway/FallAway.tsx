import type { JSX } from "react";
import type { FallAwayProps } from "@/components/FallAway/FallAway.types";

/*
  Fades + translates children down (with rotation) when `when` is true — reusable across any UI that needs
  elements to "fall away" on completion (e.g. a form's fields on success), staggered via `delay`.
*/
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
