import type { JSX } from "react";
import { animated } from "@react-spring/web";
import { CloseIcon } from "@/components/Icon";
import { useBoop } from "@/hooks/use-boop";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { SPRINGS } from "@/constants/springs";

/*
  Accepts Button's hover-driven isBooped so the twist fires on hovering the whole button, not
  just the icon; falls back to its own boop when rendered standalone.
*/
export default function RotatingCloseIcon({ isBooped: isBoopedProp }: { isBooped?: boolean }): JSX.Element {
  const [isBoopedInternal, triggerBoop] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;
  const boopStyle = useTransformBoop(isBooped, { rotation: 20, springConfig: SPRINGS.springy });

  return (
    <>
      <animated.span
        style={{ display: "inline-flex", willChange: "transform", ...boopStyle }}
        onPointerEnter={isBoopedProp === undefined ? triggerBoop : undefined}
      >
        <CloseIcon size={12} />
      </animated.span>
    </>
  );
}
