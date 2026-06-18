"use client";

import type { JSX } from "react";
import { animated } from "@react-spring/web";
import { useBoop } from "@/hooks/use-boop";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import defaultAttributes from "@/components/Icon/defaultAttributes";

// Boop glows it outward — syntax highlighting illuminating your code.
export default function IconShiki({ size = 32, isBooped: isBoopedProp }: { size?: number; isBooped?: boolean }): JSX.Element {
  const [isBoopedInternal, triggerBoop] = useBoop();
  const isBooped = isBoopedProp ?? isBoopedInternal;
  const boopStyle = useTransformBoop(isBooped, { scaleX: 1.2, scaleY: 1.2, springConfig: { tension: 350, friction: 8 } });

  return (
    <>
      <animated.span
        style={{ display: "inline-flex", willChange: "transform", ...boopStyle }}
        onPointerEnter={isBoopedProp === undefined ? triggerBoop : undefined}
      >
        <svg {...defaultAttributes} width={size} height={size}>
          <g>
            <circle cx="19.8" cy="4.19" r="4.19" fill="#CB7676"/>
            <rect y="4.33" width="24" height="5.87" fill="#4B9978"/>
            <path d="M9.8745 13.032C9.834 12.5235 9.6435 12.1275 9.303 11.8425C8.96775 11.5575 8.457 11.4157 7.77075 11.4157C7.3335 11.4157 6.97575 11.469 6.696 11.5755C6.4215 11.6775 6.21825 11.817 6.08625 11.9947C5.95425 12.1725 5.88525 12.3765 5.88075 12.6045C5.87025 12.7927 5.90325 12.963 5.97975 13.1152C6.06075 13.263 6.1875 13.398 6.36075 13.5195C6.53325 13.6365 6.7545 13.7437 7.02375 13.8397C7.293 13.9365 7.61325 14.0235 7.9845 14.0992L9.2655 14.3737C10.1295 14.5567 10.8697 14.7983 11.4848 15.0983C12.0998 15.3982 12.603 15.7515 12.9945 16.158C13.386 16.56 13.6733 17.0123 13.8563 17.5155C14.0445 18.0187 14.1412 18.5678 14.1465 19.1625C14.1412 20.19 13.884 21.06 13.3763 21.7718C12.8678 22.4835 12.141 23.025 11.1952 23.3963C10.2547 23.7675 9.12375 23.9528 7.8015 23.9528C6.444 23.9528 5.259 23.7518 4.24725 23.3505C3.24 22.9485 2.457 22.3312 1.89825 21.4973C1.344 20.658 1.065 19.5847 1.05975 18.2782H5.08725C5.11275 18.756 5.232 19.158 5.44575 19.4835C5.6595 19.809 5.9595 20.0557 6.34575 20.2237C6.73725 20.391 7.20225 20.475 7.7415 20.475C8.19375 20.475 8.5725 20.4195 8.87775 20.3078C9.18225 20.196 9.414 20.0407 9.5715 19.842C9.729 19.644 9.81075 19.4175 9.81525 19.1625C9.81075 18.9233 9.732 18.7147 9.57975 18.537C9.432 18.354 9.18825 18.1913 8.84775 18.0488C8.50725 17.901 8.04675 17.7637 7.467 17.637L5.91075 17.2875C4.527 16.9875 3.43575 16.4865 2.63775 15.7845C1.84425 15.0773 1.4505 14.1135 1.45575 12.8925C1.4505 11.9002 1.71525 11.0325 2.25 10.29C2.78925 9.54225 3.53475 8.9595 4.48575 8.5425C5.442 8.1255 6.53775 7.917 7.77075 7.917C9.03225 7.917 10.1235 8.1285 11.0445 8.55C11.9655 8.973 12.675 9.56775 13.173 10.3358C13.6733 11.1113 13.9275 12.0038 13.9328 13.032H9.8745Z" fill="#83D0DA"/>
            <rect x="19.58" width="24" height="5.87" transform="rotate(90 19.58 0)" fill="#E6CC78"/>
          </g>
        </svg>
      </animated.span>
    </>
  );
}

IconShiki.displayName = "IconShiki";
