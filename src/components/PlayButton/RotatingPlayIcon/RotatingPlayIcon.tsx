import type { JSX } from "react";
import { animated } from "@react-spring/web";
import { PlayIcon } from "@/components/Icon";
import { useBoop } from "@/hooks/use-boop";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { SPRINGS } from "@/constants/springs";

/*
  Accepts Button's hover-driven isBooped so the tilt fires on hovering the whole button, not
  just the icon; falls back to its own boop when rendered standalone.
*/
export default function RotatingPlayIcon({ isBooped: isBoopedProp }: { isBooped?: boolean }): JSX.Element {
  const [isBoopedInternal, triggerBoop] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;
  const boopStyle = useTransformBoop(isBooped, { rotation: 10, ...SPRINGS.default });

  return (
    <>
      <animated.span
        style={{ display: "inline-flex", willChange: "transform", ...boopStyle }}
        onPointerEnter={isBoopedProp === undefined ? triggerBoop : undefined}
      >
        <PlayIcon size={18} />
      </animated.span>
    </>
  );
}
