"use client";

import { forwardRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import { IconHamburgerProps } from "@/interfaces/icons/hamburger";
import {
  VIEWBOX_SIZE,
  getFirstLineProps,
  getSecondLineProps,
  getThirdLineProps
} from "@/icons/IconHamburger.helpers";

// Spring-animated hamburger/X button — owns boop state and the scale wrapper; parent only drives iconStatus and isOpen.
const IconHamburger = forwardRef<HTMLButtonElement, IconHamburgerProps>(
  function IconHamburger(
    { iconStatus, isOpen, size = 20, className, onPointerEnter, ...rest },
    ref
  ) {
    const [isBooped, triggerBoop] = useBoop();
    const prefersReducedMotion = usePrefersReducedMotion();

    const sharedConfig = {
      tension: 300,
      friction: 16,
      /*
        clamp during transition so lines stop cleanly at centre;
        unclamped at rest so boop has natural spring bounce
      */
      clamp: iconStatus === "opening" || iconStatus === "closing"
    };

    const firstLineProps = useSpring({
      ...getFirstLineProps(iconStatus, isBooped),
      config: sharedConfig,
      immediate: prefersReducedMotion
    });
    const secondLineProps = getSecondLineProps();
    const thirdLineProps = useSpring({
      ...getThirdLineProps(iconStatus, isBooped),
      config: sharedConfig,
      immediate: prefersReducedMotion
    });

    const showPatty = iconStatus === "closed" || iconStatus === "opening";

    return (
      <>
        <button
          ref={ref}
          className={className}
          onPointerEnter={(e) => {
            triggerBoop();
            onPointerEnter?.(e);
          }}
          {...rest}
        >
          {/* CSS scale — transition, not a spring. Inline styles beat the global reduced-motion stylesheet reset, so it's gated here directly. */}
          <span
            style={{
              display: "block",
              transform: isOpen ? "scale(1.5)" : "scale(1)",
              transition: prefersReducedMotion ? "none" : "transform 400ms",
              willChange: "transform"
            }}
          >
            <svg
              {...defaultAttributes}
              viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
              width={size}
              height={size}
              fill="none"
              stroke="currentColor"
              style={{ display: "block", overflow: "visible" }}
            >
              <animated.line {...firstLineProps} />
              <line {...secondLineProps} style={{ opacity: showPatty ? 1 : 0 }} />
              <animated.line {...thirdLineProps} />
            </svg>
          </span>
        </button>
      </>
    );
  }
);

IconHamburger.displayName = "IconHamburger";
export default IconHamburger;
