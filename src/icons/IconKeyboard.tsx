"use client";

import type { JSX } from "react";
import { useSprings } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconToggleStatus } from "@/hooks/use-toggle-icon-status";

/*
  Props for IconKeyboard — a static frame around a few keycaps that spring-press in a
  left-to-right wave when isBooped goes true, evoking a shortcut being typed.
*/
export interface IconKeyboardProps {
  size?: number;
  isBooped: boolean;
  status?: IconToggleStatus;
}
import { KEY_LAYOUT, getKeySpringTarget } from "@/icons/IconKeyboard.helpers";
import { Key } from "@/icons/styles/IconKeyboard.styles";

/*
  Keyboard-shortcuts icon — a static frame around a few keycaps that spring-press left-to-right
  (then release right-to-left) when isBooped goes true, evoking a shortcut being typed. isBooped
  is owned by the caller via useBoop, fired on pointer enter — same "icon owns the animation,
  caller owns the trigger" split as IconDismiss.
*/
export default function IconKeyboard({ size = 20, isBooped, status = "idle" }: IconKeyboardProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [springs] = useSprings(
    KEY_LAYOUT.length,
    (index) => ({
      ...getKeySpringTarget(index, isBooped),
      config: SPRINGS.springy,
      immediate: prefersReducedMotion
    }),
    [isBooped, prefersReducedMotion]
  );

  return (
    <>
      <svg
        {...defaultAttributes}
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        style={{ display: "block", overflow: "visible", opacity: status !== "idle" ? 1 : 0.7 }}
      >
        <rect x="1" y="5" width="22" height="14" rx="3" />
        {springs.map((spring, index) => (
          <Key
            key={index}
            x={KEY_LAYOUT[index].x}
            width={KEY_LAYOUT[index].width}
            height={3}
            rx={0.75}
            {...spring}
          />
        ))}
      </svg>
    </>
  );
}

IconKeyboard.displayName = "IconKeyboard";
