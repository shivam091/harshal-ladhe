"use client";

import type { JSX} from "react";
import { useRef, useEffect } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useTransformBoop } from "@/hooks/use-transform-boop";
import { SPRINGS } from "@/constants/springs";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconDownloadProps } from "@/interfaces/icons/download";
import { SHAPE_DATA, getTrayPath, getArrowPoints } from "@/icons/IconDownload.helpers";

/*
  Spring-animated download icon: the tray widens and the arrow retracts into it while pressed and
  held, as if the file were dropping in, then settles back to the resting shape on release, plus a
  boop pop (matching IconDiffGutter/IconIndentGuides' own scale boop) on hover/click. The arrow (not
  the tray) switches to accentColor for that same pressed-and-held span. Used by DownloadZipButton
  as the icon for the "download sandbox as .zip" action.
*/
export default function IconDownload({ size = 16, status = "idle", accentColor }: IconDownloadProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const boopStyle = useTransformBoop(status === "booped", { scaleX: 1.12, scaleY: 1.12 });
  // Prevents the initial mount from triggering an animated transition (should snap to the resting shape).
  const isMounted = useRef(false);

  const [shape, api] = useSpring(() => ({ ...SHAPE_DATA.idle, config: SPRINGS.quick }));

  useEffect(() => {
    isMounted.current = true;
  }, []);

  // Drives the shape to the resting or pressed geometry whenever status or motion preference changes.
  useEffect(() => {
    api.start({
      ...(status === "pressed" ? SHAPE_DATA.pressed : SHAPE_DATA.idle),
      immediate: !isMounted.current || prefersReducedMotion
    });
  }, [status, prefersReducedMotion, api]);

  return (
    <>
      <svg
        {...defaultAttributes}
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        style={{ overflow: "visible", opacity: status !== "idle" ? 1 : 0.7 }}
      >
        <animated.g style={boopStyle}>
          <animated.path d={to([shape.trayLeft, shape.trayRight], getTrayPath)} />
          <animated.polyline
            points={shape.arrowY.to(getArrowPoints)}
            stroke={status === "pressed" ? accentColor : undefined}
          />
          <animated.line
            x1={12}
            x2={12}
            y1={15}
            y2={shape.shaftY2}
            stroke={status === "pressed" ? accentColor : undefined}
          />
        </animated.g>
      </svg>
    </>
  );
}

IconDownload.displayName = "IconDownload";
