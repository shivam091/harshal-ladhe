"use client";

import type { JSX } from "react";
import { useSprings, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

const SPRING_CONFIG = { tension: 300, friction: 16 };

// Rest-state width for the two text-line bars (top line, then bottom line).
const LINE_WIDTH_REST = [6, 4] as const;
// Boop-state width — each bar stretches rightward.
const LINE_WIDTH_BOOP = [8, 6] as const;
// Stagger (ms) so the bottom line follows the top line rather than firing together.
const LINE_DELAY = [100, 200] as const;

// Text lines stretch in sequence so the boop reads like a line being written.
export default function IconFile({ size = 20, isBooped: isBoopedProp }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Fallback so the icon still boops on its own when no parent controls it.
  const [isBoopedInternal] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  const lineSprings = useSprings(
    LINE_WIDTH_REST.length,
    LINE_WIDTH_REST.map((rest, i) => ({
      width: isBooped ? LINE_WIDTH_BOOP[i] : rest,
      delay: LINE_DELAY[i],
      config: SPRING_CONFIG,
      immediate: prefersReducedMotion
    }))
  );

  return (
    <>
      <svg {...defaultAttributes} width={size} height={size}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 5C4 3.34315 5.34315 2 7 2H14.1716C14.9672 2 15.7303 2.31607 16.2929 2.87868L19.1213 5.70711C19.6839 6.26972 20 7.03278 20 7.82843V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V5ZM7 4C6.44772 4 6 4.44772 6 5V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7.82843C18 7.56321 17.8946 7.30886 17.7071 7.12132L14.8787 4.29289C14.6911 4.10536 14.4368 4 14.1716 4H7Z"
        />
        <animated.rect x="9" y="9" height="2" rx="1" {...lineSprings[0]} />
        <animated.rect x="9" y="13" height="2" rx="1" {...lineSprings[1]} />
      </svg>
    </>
  );
}

IconFile.displayName = "IconFile";
