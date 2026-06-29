"use client";

import type { JSX } from "react";
import { useSpring, useSprings, animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/icons/icons";

// Same outline as the static registry "bulb" so the animated and static icons are interchangeable.
const BULB_PATH = "m12 3c-3.585 0-6.5 2.9225-6.5 6.5385 0 2.2826 1.162 4.2913 2.9248 5.4615h7.1504c1.7628-1.1702 2.9248-3.1789 2.9248-5.4615 0-3.6159-2.915-6.5385-6.5-6.5385zm2.8653 14h-5.7306v1h5.7306v-1zm-1.1329 3h-3.4648c0.3458 0.5978 0.9921 1 1.7324 1s1.3866-0.4022 1.7324-1zm-5.6064 0c0.44403 1.7252 2.0101 3 3.874 3s3.43-1.2748 3.874-3c0.5483-0.0047 0.9913-0.4506 0.9913-1v-2.4593c2.1969-1.5431 3.6347-4.1045 3.6347-7.0022 0-4.7108-3.8008-8.5385-8.5-8.5385-4.6992 0-8.5 3.8276-8.5 8.5385 0 2.8977 1.4378 5.4591 3.6347 7.0022v2.4593c0 0.5494 0.44301 0.9953 0.99128 1z";

// The glass hollow inside the outline, filled separately so it can light up without touching the outline.
const GLASS_PATH = "m12 3c-3.585 0-6.5 2.9225-6.5 6.5385 0 2.2826 1.162 4.2913 2.9248 5.4615h7.1504c1.7628-1.1702 2.9248-3.1789 2.9248-5.4615 0-3.6159-2.915-6.5385-6.5-6.5385z";

// Centre of the bulb's glass, so the rays radiate from where the light would be.
const CX = 12;
const CY = 9.54;

// Just clear of the outline so the rays never touch the glass, and a little past the viewBox so they still read at icon size.
const RAY_INNER = 10.25;
const RAY_OUTER = 12.5;

// Upper half only, since the screw base would hide any rays below the glass.
const RAY_ANGLES = [-90, -50, -130, -10, -170] as const;

// Top ray first, then outward pairs, so the flash spreads rather than appearing all at once.
const RAY_DELAY = [0, 40, 40, 80, 80] as const;

// The warm amber of a glowing filament, so the lit bulb reads as real light rather than a flat UI yellow.
const LIT_COLOUR = "#FFC107";

// A bulb switching on is the universal "idea" cue, so the boop lights it up rather than merely nudging it.
export default function IconBulb({ size = 20, isBooped: isBoopedProp }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Fallback so the icon still lights on its own when no parent controls it.
  const [isBoopedInternal, triggerBoop] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;

  // Opacity of the tinted layers, so the colour change rides the same spring as everything else.
  const { glow } = useSpring({
    glow: isBooped ? 1 : 0,
    config: SPRINGS.quick,
    immediate: prefersReducedMotion
  });

  // Ray length eases 0 → 1 without overshoot, so the rays grow out smoothly rather than bouncing.
  const raySprings = useSprings(
    RAY_ANGLES.length,
    RAY_ANGLES.map((_, i) => ({
      length: isBooped ? 1 : 0,
      delay: isBooped ? RAY_DELAY[i] : 0,
      config: SPRINGS.default,
      immediate: prefersReducedMotion
    }))
  );

  return (
    <>
      <svg
        {...defaultAttributes}
        width={size}
        height={size}
        // The base layer turns off pointer events on every svg, so a self-booping icon has to opt back in.
        style={{ overflow: "visible", pointerEvents: isBoopedProp === undefined ? "auto" : undefined }}
        onPointerEnter={isBoopedProp === undefined ? triggerBoop : undefined}
      >
        <animated.path d={GLASS_PATH} fill={LIT_COLOUR} fillOpacity={glow.to((g) => g * 0.35)} />
        <path d={BULB_PATH} fillRule="evenodd" clipRule="evenodd" />
        <animated.path d={BULB_PATH} fillRule="evenodd" clipRule="evenodd" fill={LIT_COLOUR} opacity={glow} />
        {raySprings.map(({ length }, i) => {
          const rad = (RAY_ANGLES[i] * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          return (
            <animated.line
              key={i}
              x1={CX + cos * RAY_INNER}
              y1={CY + sin * RAY_INNER}
              x2={length.to((l) => CX + cos * (RAY_INNER + (RAY_OUTER - RAY_INNER) * l))}
              y2={length.to((l) => CY + sin * (RAY_INNER + (RAY_OUTER - RAY_INNER) * l))}
              stroke={LIT_COLOUR}
              strokeWidth={1.5}
              opacity={length.to((l) => Math.min(Math.max(l, 0), 1))}
            />
          );
        })}
      </svg>
    </>
  );
}

IconBulb.displayName = "IconBulb";
