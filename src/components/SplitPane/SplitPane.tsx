"use client";

import type { JSX } from "react";
import React from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import { useDrag } from "@/hooks/use-drag";
import type { SplitPaneProps } from "@/interfaces/split-pane";
import {
  DIVIDER_WIDTH,
  Wrapper,
  Container,
  FirstPane,
  SecondPane,
  Divider
} from "@/components/SplitPane/SplitPane.styles";

// Resizable two-pane layout with a draggable/keyboard divider; can flip to vertical below a breakpoint.
export default function SplitPane({
  className = "",
  splitRatio = 0.5,
  isFullscreened = false,
  direction: preferredDirection = "horizontal",
  mobileBreakpoint,
  onDirectionChange,
  children
}: SplitPaneProps): JSX.Element {
  const rulerRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dividerRef = React.useRef<HTMLButtonElement>(null);

  const [isBelowBreakpoint, setIsBelowBreakpoint] = React.useState(false);

  React.useEffect(() => {
    if (!mobileBreakpoint) return;

    const mq = window.matchMedia(`(width <= ${mobileBreakpoint}px)`);
    const update = () => setIsBelowBreakpoint(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [mobileBreakpoint]);

  const direction =
    mobileBreakpoint && isBelowBreakpoint ? "vertical" : preferredDirection;

  React.useEffect(() => {
    onDirectionChange?.(direction);
  }, [direction, onDirectionChange]);

  const { firstSize, secondSize } = useDrag({
    defaultRatio: splitRatio,
    rulerRef: rulerRef as React.RefObject<HTMLElement | null>,
    containerRef: containerRef as React.RefObject<HTMLElement | null>,
    dividerRef: dividerRef as React.RefObject<HTMLElement | null>,
    dividerWidth: DIVIDER_WIDTH,
    isFullscreened,
    direction
  });

  const [firstChild, secondChild] = React.Children.toArray(children);

  return (
    <>
      <div ref={rulerRef} />
      <Wrapper style={{ flex: isFullscreened ? 1 : undefined }}>
        <Container
          className={className}
          ref={containerRef}
          data-direction={direction}
        >
          <FirstPane
            data-direction={direction}
            style={{ "--pane-flex": firstSize } as React.CSSProperties}
          >
            {firstChild}
          </FirstPane>
          <Divider ref={dividerRef} data-direction={direction}>
            <VisuallyHidden>
              Resize editor. Use{" "}
              {direction === "vertical" ? "up/down" : "left/right"} arrows.
            </VisuallyHidden>
          </Divider>
          <SecondPane
            data-direction={direction}
            style={{ "--pane-flex": secondSize } as React.CSSProperties}
          >
            {secondChild}
          </SecondPane>
        </Container>
      </Wrapper>
    </>
  );
}
