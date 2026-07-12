import { useSpring } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";

// Every field optional so each icon specifies only the axes it moves; the rest stay at identity.
export interface TransformBoopConfig {
  transformX?: number;
  transformY?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  skewX?: number;
  skewY?: number;
  springConfig?: { tension?: number; friction?: number };
}

// Centralises boop transforms so icons share one spring feel and reduced-motion handling instead of wiring their own.
export function useTransformBoop(
  isBooped: boolean,
  {
    transformX = 0,
    transformY = 0,
    rotation = 0,
    scaleX = 1,
    scaleY = 1,
    skewX = 0,
    skewY = 0,
    springConfig = SPRINGS.springy
  }: TransformBoopConfig = {}
) {
  const prefersReducedMotion = usePrefersReducedMotion();
  return {
    ...useSpring({
      transform:
        isBooped && !prefersReducedMotion
          ? `translate(${transformX}px, ${transformY}px) rotate(${rotation}deg) scaleX(${scaleX}) scaleY(${scaleY}) skewX(${skewX}deg) skewY(${skewY}deg)`
          : `translate(0px, 0px) rotate(0deg) scaleX(1) scaleY(1) skewX(0deg) skewY(0deg)`,
      config: springConfig
    }),
    backfaceVisibility: "hidden" as const,
    transformOrigin: "center" as const
  };
}
