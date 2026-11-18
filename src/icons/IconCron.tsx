"use client";

import type { JSX } from "react";
import { useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

// Shared centre of the hands and the looping arrow, so everything turns about the same point.
const CX = 12;
const CY = 12;

// Half a turn round, so the arrowhead sits at the lower left, clear of the hands it would otherwise crowd at 3 o'clock.
const RING_REST_DEG = 180;

// The hour hand rests exactly on 3 o'clock, so every hour-mark step from there lands squarely on the next hour.
const HOUR_HAND_LENGTH = 3.5;
const HOUR_REST_RAD = (90 * Math.PI) / 180;
const HOUR_TIP_X = CX + HOUR_HAND_LENGTH * Math.sin(HOUR_REST_RAD);
const HOUR_TIP_Y = CY - HOUR_HAND_LENGTH * Math.cos(HOUR_REST_RAD);

// The minute hand sweeps a full hour per run, so the hour hand has to advance one hour mark to stay truthful.
const HOUR_MARK_DEG = 30;

// A cron job firing on boop — an hour passes on the hands while the looping arrow turns, the schedule coming round again.
export default function IconCron({ size = 20, isBooped: isBoopedProp }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Fallback so the icon still boops on its own when no parent controls it.
  const [isBoopedInternal, triggerBoop] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;
  // Counts boops rather than following isBooped, so the hands only ever move forwards, like real time.
  const runsRef = useRef(0);

  // The minute hand overshoots the top of the hour and rocks back, like a clock hand landing on the mark.
  const [{ minute }, minuteApi] = useSpring(() => ({ minute: 0, config: SPRINGS.quick }));

  // Its short 30° hop gets the springier preset, so the hour hand visibly jostles into place rather than creeping.
  const [{ hour }, hourApi] = useSpring(() => ({ hour: 0, config: SPRINGS.springy }));

  // Slightly slower to settle than the hands, so the arrow trails them round and the three don't stop in lockstep.
  const [{ spin }, spinApi] = useSpring(() => ({ spin: 0, config: { tension: 200, friction: 14 } }));

  // Each new boop is one more run of the schedule; releasing it leaves the clock where it got to.
  useEffect(() => {
    if (!isBooped || prefersReducedMotion) return;
    runsRef.current += 1;
    minuteApi.start({ minute: runsRef.current * 360 });
    hourApi.start({ hour: runsRef.current * HOUR_MARK_DEG });
    spinApi.start({ spin: runsRef.current * 360 });
  }, [isBooped, prefersReducedMotion, minuteApi, hourApi, spinApi]);

  return (
    <>
      <svg
        {...defaultAttributes}
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        // The base layer turns off pointer events on every svg, so a self-booping icon has to opt back in.
        style={{ overflow: "visible", pointerEvents: isBoopedProp === undefined ? "auto" : undefined }}
        onPointerEnter={isBoopedProp === undefined ? triggerBoop : undefined}
      >
        <animated.g transform={spin.to((deg) => `rotate(${RING_REST_DEG + deg} ${CX} ${CY})`)}>
          <path d="M21 12 A9 9 0 1 1 12 3 C14.52 3 16.93 4 18.74 5.74 L21 8" />
          <path d="M21 3 L21 8 L16 8" />
        </animated.g>
        <animated.line x1={CX} y1={CY} x2="12" y2="7" transform={minute.to((deg) => `rotate(${deg} ${CX} ${CY})`)} />
        <animated.line x1={CX} y1={CY} x2={HOUR_TIP_X} y2={HOUR_TIP_Y} transform={hour.to((deg) => `rotate(${deg} ${CX} ${CY})`)} />
      </svg>
    </>
  );
}

IconCron.displayName = "IconCron";
