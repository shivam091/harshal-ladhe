"use client";

import type { JSX } from "react";
import { useBoundingBox } from "@/hooks/use-bounding-box";
import { usePointerPositionWhenNearElement } from "@/hooks/use-pointer-position-when-near-element";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { NUM_BALLS, BALL_COLORS, ROW_PROXIMITY_RADIUS_PX } from "@/components/FooterDivider/FooterDivider.constants";
import { getBallCenter, getBallFillScale, getBallBlurPx } from "@/components/FooterDivider/FooterDivider.helpers";
import { Wrapper, BallWrapper, BallFill } from "@/components/FooterDivider/FooterDivider.styles";
import type { FooterDividerProps } from "@/components/FooterDivider/FooterDivider.types";

/*
  Row of color balls inspired by whimsy.joshwcomeau.com's footer divider: each ball fills in and
  sharpens into focus proportionally to how close the cursor is to its center, reading as a wave of
  focus rather than an all-or-nothing hover state.
*/
export default function FooterDivider({ className }: FooterDividerProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  // Blur is a hover affordance — on touch there's no cursor to sharpen it, so it'd just look unfinished.
  const supportsHoverBlur = useMediaQuery("(pointer: fine) and (hover: hover)");

  const [rowRef, rowBoundingBox] = useBoundingBox<HTMLDivElement>();
  const cursorPoint = usePointerPositionWhenNearElement({
    boundingBox: rowBoundingBox,
    radius: ROW_PROXIMITY_RADIUS_PX
  });

  // No cursor-driven fill at all under reduced motion, rather than a wave that's merely instant.
  const fillScales =
    rowBoundingBox && !prefersReducedMotion
      ? Array.from({ length: NUM_BALLS }, (_, index) => getBallFillScale(getBallCenter(index, rowBoundingBox), cursorPoint))
      : Array.from({ length: NUM_BALLS }, () => 0);

  return (
    <>
      <Wrapper ref={rowRef} className={className}>
        {fillScales.map((scale, index) => (
          <BallWrapper key={index} style={{ "--color": BALL_COLORS[index] } as React.CSSProperties}>
            <BallFill
              style={{
                transform: `scale(${scale})`,
                filter: supportsHoverBlur ? `blur(${getBallBlurPx(scale)}px)` : "blur(0px)"
              }}
            />
          </BallWrapper>
        ))}
      </Wrapper>
    </>
  );
}

FooterDivider.displayName = "FooterDivider";
