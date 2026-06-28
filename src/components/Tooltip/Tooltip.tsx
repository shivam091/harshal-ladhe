"use client";

import { JSX, useEffect, useRef, useState } from "react";
import * as Radix from "@radix-ui/react-tooltip";
import Trigger from "@/components/Trigger";
import Tip from "@/components/Tip";
import { useHoverDevice } from "@/hooks/use-hover-device";
import type { TooltipProps } from "@/interfaces/tooltip";
import { contentClass } from "@/components/Tooltip/Tooltip.styles";

/*
  Reusable tooltip built on Radix primitives, themed with the project's color
  scheme variables and the same animated curved tip as DropdownMenu.

  Touch support: Radix shows tooltips on hover/focus only and suppresses them on
  touch. So on coarse-pointer devices we drive the controlled open state with a
  tap on the trigger (toggle) and dismiss on an outside tap; on pointer devices
  Radix's hover/focus behaviour is used as-is.
*/
export default function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  sideOffset = 8,
  delayDuration = 200,
  forceOpen = false,
}: TooltipProps): JSX.Element {
  const isHoverDevice = useHoverDevice();
  const isTouch = isHoverDevice === false;
  const hasContent = content !== undefined && content !== null && content !== "";

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  /*
    Callers like ResetButton toggle `content` itself (string ↔ undefined) to drive a
    programmatic hint rather than static hover text. Keeping the last real content around while
    it's closing — instead of rendering `content` directly — means the close animation below has
    something to fade out; otherwise the text (and the whole Radix tree, see the early return
    further down) would disappear on the same render `content` goes empty, before Presence ever
    gets a chance to animate anything out.
  */
  const [lastContent, setLastContent] = useState(content);
  useEffect(() => {
    if (hasContent) setLastContent(content);
  }, [content, hasContent]);

  const isOpen = forceOpen || (hasContent && open);

  /*
    On pointer devices let Radix (hover/focus/escape) drive open; on touch ignore
    Radix's auto open/close and rely on the tap handlers below.
  */
  const handleOpenChange = (next: boolean): void => {
    if (!isTouch) setOpen(next);
  };

  // Touch only: tap the trigger to toggle the tooltip.
  const handleTriggerClick = (): void => {
    if (isTouch) setOpen((prev) => !prev);
  };

  // Touch only: dismiss when tapping outside the trigger and content.
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
    Content has never been provided → render the trigger untouched (no tooltip wiring).
    `lastContent`, not `content`, so a caller merely toggling content closed keeps the Radix
    tree (and its close animation) mounted instead of unmounting it outright.
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
