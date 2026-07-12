"use client";

import type { JSX } from "react";
import type { TriggerProps } from "@/interfaces/trigger";

// Shared trigger for Radix overlay primitives (DropdownMenu, Tooltip). Renders
// the given Radix *.Trigger with `asChild` so the consumer's element is the
// trigger, and forwards an optional ref for callers that measure it.
export default function Trigger({
  primitive: Primitive,
  children,
  className,
  triggerRef,
  onClick
}: TriggerProps): JSX.Element {
  return (
    <>
      <Primitive asChild ref={triggerRef} className={className} onClick={onClick}>
        {children}
      </Primitive>
    </>
  );
}

Trigger.displayName = "Trigger";
