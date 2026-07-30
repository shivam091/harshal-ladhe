import type { JSX } from "react";
import { memo } from "react";
import { animated } from "@react-spring/web";
import { TONGUE_PATH } from "@/components/LikeHeart/Mouth/Mouth.helpers";
import type { MouthProps as Props } from "@/interfaces/like-button";

// The heart's mouth: a happy/sad inverting curve, or an open tongue-out grin once a like has succeeded.
function Mouth({ status, mouthSpring }: Props): JSX.Element {
  // Whether to show the open tongue-out grin instead of the happy/sad curve.
  const hasLiked = status === "super-happy";

  return (
    <>
      <g>
        <mask id="like-tongue-mask" maskUnits="userSpaceOnUse" x="20" y="27" width="11" height="6">
          <path d={TONGUE_PATH} fill="#ffffff" />
        </mask>
        {/* Open, tongue-out grin — shown once a like has succeeded. */}
        <g mask="url(#like-tongue-mask)" style={{ opacity: hasLiked ? 1 : 0 }}>
          <path d={TONGUE_PATH} fill="var(--open-mouth-color)" />
          <circle cx="25" cy="35" r="5" fill="var(--tongue-color)" />
        </g>
        {/* Happy/sad inverting mouth — a quadratic curve whose control point animates between the two. */}
        <animated.path
          d={mouthSpring.position.to((y) => `M 20 30 Q 25 ${y} 30 30`)}
          stroke="var(--face-color)"
          strokeLinecap="round"
          style={{ opacity: hasLiked ? 0 : 1 }}
        />
      </g>
    </>
  );
}

Mouth.displayName = "Mouth";

export default memo(Mouth);
