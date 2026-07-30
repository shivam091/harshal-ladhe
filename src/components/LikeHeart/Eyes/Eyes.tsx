import type { JSX } from "react";
import { memo } from "react";
import { animated, to } from "@react-spring/web";
import type { EyesProps } from "@/interfaces/like-button";

// The heart's eyes: default pupils tracking a nearby cursor, or an extra-happy closed-eye smile once a like has succeeded.
function Eyes({ status, eyeSpring }: EyesProps): JSX.Element {
  return (
    <>
      {/* Eyes — default, pupils tracking a nearby cursor. */}
      <animated.g
        style={{
          opacity: status === "super-happy" ? 0 : 1,
          transform: to([eyeSpring.x, eyeSpring.y], (x, y) => `translate(${x}px, ${y}px)`)
        }}
      >
        <circle cx="15" cy="22" r="2" fill="var(--face-color)" />
        <circle cx="35" cy="22" r="2" fill="var(--face-color)" />
      </animated.g>
      {/* Eyes — extra happy, shown once a like has succeeded. */}
      <g style={{ opacity: status === "super-happy" ? 1 : 0 }}>
        <path
          d="M 13 23 Q 15 19, 17 23 "
          stroke="var(--face-color)"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
        <path
          d="M 33 23 Q 35 19, 37 23 "
          stroke="var(--face-color)"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </g>
    </>
  );
}

Eyes.displayName = "Eyes";

export default memo(Eyes);
