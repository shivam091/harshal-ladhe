"use client";

import type { JSX } from "react";
import { useSpring } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconBoopProps } from "@/interfaces/icons";
import { Wrapper, ShimmerWrapper, Shimmer, Svg } from "@/icons/styles/IconSearch.styles";

/*
  Magnifying-glass icon for the header's search trigger — boops (scale 1.1 + 8° tilt) on
  hover and sweeps a soft light "shimmer" across the lens. Ported verbatim from the reference
  implementation's own IconSearch: same spring configs, same shimmer sweep technique (a
  spring-driven span rotating/translating across a clipped lens patch), same light-theme-only
  hidden shimmer — rather than this project's shared trigger-driven Shimmer component (used
  elsewhere by CodeBlock), which doesn't reproduce this exact motion.
*/
export default function IconSearch({ size = 20, isBooped = false }: IconBoopProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();

  const iconStyle = useSpring({
    transform: isBooped ? "scale(1.1) rotate(8deg)" : "scale(1) rotate(0deg)",
    config: { tension: 300, friction: 10 },
    immediate: prefersReducedMotion
  });

  const shimmerStyle = useSpring({
    transform: isBooped ? "rotate(-20deg) translateX(-40%)" : "rotate(-20deg) translateX(50%)",
    config: { tension: 300, friction: 12 },
    immediate: prefersReducedMotion
  });

  return (
    <>
      <Wrapper>
        <ShimmerWrapper>
          <Shimmer style={shimmerStyle} />
        </ShimmerWrapper>
        <Svg
          {...defaultAttributes}
          aria-hidden="true"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          style={iconStyle}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </Svg>
      </Wrapper>
    </>
  );
}

IconSearch.displayName = "IconSearch";
