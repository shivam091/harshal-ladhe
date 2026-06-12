"use client";

import type { JSX} from "react";
import { useCallback, useContext, useRef } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import type { DropdownContentProps } from "@/components/DropdownMenu/DropdownContent/DropdownContent.types";
import { DropdownCtx, TriggerRefCtx } from "@/components/DropdownMenu/DropdownMenu";
import { DropdownTip } from "@/components/DropdownMenu/DropdownTip";
import { contentClass, ContentInner } from "@/components/DropdownMenu/DropdownContent/DropdownContent.styles";

// Resolves "auto" at open time because the roomiest side depends on where the trigger sits right now.
export default function DropdownContent({
  children,
  side = "auto",
  align = "end",
  sideOffset = 16,
  className,
  "aria-label": ariaLabel
}: DropdownContentProps): JSX.Element {
  const { autoSide } = useContext(DropdownCtx);
  const triggerRef = useContext(TriggerRefCtx);
  const resolvedSide = side === "auto" ? autoSide : side;
  // A click outside already put focus where the reader wanted it, so the trigger shouldn't reclaim it.
  const interactedOutsideRef = useRef(false);

  // html's scroll-padding makes the sticky trigger look obscured, so a default focus return would scroll the page on every close.
  const handleCloseAutoFocus = useCallback((event: Event) => {
    event.preventDefault();
    if (!interactedOutsideRef.current) triggerRef.current?.focus({ preventScroll: true });
    interactedOutsideRef.current = false;
  }, [triggerRef]);

  return (
    <>
      <Radix.Portal>
        <Radix.Content
          side={resolvedSide}
          align={align}
          sideOffset={sideOffset}
          aria-label={ariaLabel}
          onCloseAutoFocus={handleCloseAutoFocus}
          onInteractOutside={() => { interactedOutsideRef.current = true; }}
          className={[contentClass, className].filter(Boolean).join(" ")}
        >
          <DropdownTip />
          <ContentInner>{children}</ContentInner>
        </Radix.Content>
      </Radix.Portal>
    </>
  );
}

DropdownContent.displayName = "DropdownContent";
