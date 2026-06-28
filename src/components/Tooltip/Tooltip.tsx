"use client";

import type { JSX} from "react";
import { useEffect, useRef, useState } from "react";
import * as Radix from "@radix-ui/react-tooltip";
import Trigger from "@/components/Trigger";
import Tip from "@/components/Tip";
import { useHoverDevice } from "@/hooks/use-hover-device";
import type { TooltipProps } from "@/components/Tooltip/Tooltip.types";
import { contentClass } from "@/components/Tooltip/Tooltip.styles";

/*
  Radix suppresses tooltips on touch, so coarse-pointer devices get tap-to-toggle
  open state here while pointer devices keep Radix's behaviour.
*/
export default function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 8,
  delayDuration = 200,
  forceOpen = false
}: TooltipProps): JSX.Element {
  const isHoverDevice = useHoverDevice();
  const isTouch = isHoverDevice === false;
  const hasContent = content !== undefined && content !== null && content !== "";

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  /*
    Kept so the close animation has text to fade out when `content` goes empty — otherwise the
    text and the whole Radix tree (via the early return below) would vanish before Presence can
    animate anything out.
  */
  const [lastContent, setLastContent] = useState(content);
  useEffect(() => {
    if (hasContent) setLastContent(content);
  }, [content, hasContent]);

  const isOpen = forceOpen || (hasContent && open);

  // Radix's auto open/close is ignored on touch, where it would fight the tap handlers.
  const handleOpenChange = (next: boolean): void => {
    if (isTouch) return;
    setOpen(next);
  };

  // Touch has no hover, so a tap on the trigger stands in for it.
  const handleTriggerClick = (): void => {
    if (!isTouch) return;
    setOpen(!open);
  };

  // Touch has no pointer-leave, so an outside tap is the only natural way to dismiss.
  useEffect(() => {
    if (!isTouch || !open) return;

    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isTouch, open]);

  /*
    Checks lastContent rather than content so toggling content closed keeps the Radix tree (and
    its close animation) mounted; only never-provided content skips the tooltip wiring.
  */
  if (lastContent === undefined || lastContent === null || lastContent === "") {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <>
      <Radix.Provider delayDuration={delayDuration}>
        <Radix.Root open={isOpen} onOpenChange={handleOpenChange} disableHoverableContent={isTouch}>
          <Trigger primitive={Radix.Trigger} triggerRef={triggerRef} onClick={handleTriggerClick}>
            {children}
          </Trigger>
          <Radix.Portal>
            <Radix.Content
              ref={contentRef}
              side={side}
              align={align}
              sideOffset={sideOffset}
              className={contentClass}
            >
              {lastContent}
              <Tip arrow={Radix.Arrow} isOpen={isOpen} />
            </Radix.Content>
          </Radix.Portal>
        </Radix.Root>
      </Radix.Provider>
    </>
  );
}

Tooltip.displayName = "Tooltip";
