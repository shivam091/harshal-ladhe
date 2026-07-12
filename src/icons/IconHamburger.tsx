"use client";

import { forwardRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import {
  VIEWBOX_SIZE,
  getFirstLineProps,
  getSecondLineProps,
  getThirdLineProps
} from "@/icons/IconHamburger.helpers";

// Represents the animation phase of the hamburger ↔ close icon transition
export type IconHamburgerStatus = "closed" | "opening" | "open" | "closing";

// Parent passes iconStatus (derived from isPressed + drawerOpen) and isOpen (controls scale); boop is owned internally.
export interface IconHamburgerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Derived by the parent from its isPressed + drawerOpen state
  iconStatus: IconHamburgerStatus;
  // Controls the scale(1.5) wrapper — true when drawer is open
  isOpen: boolean;
  size?: number;
}

// Owns boop and scale internally so the parent only has to drive open/close state.
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
