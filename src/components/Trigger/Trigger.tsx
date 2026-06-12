"use client";

import type { JSX } from "react";
import type { TriggerProps } from "@/components/Trigger/Trigger.types";

// Uses asChild so the caller's own element becomes the trigger, avoiding a nested button and keeping its styling intact.
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
