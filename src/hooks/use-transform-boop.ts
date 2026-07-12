import { useSpring } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SPRINGS } from "@/constants/springs";

// CSS transform parameters for a boop animation — all fields are optional, defaulting to no-op identity values.
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

// Takes a boolean boop state and transform config, returns a spring-animated style ready to spread onto an `animated.*` element.
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
