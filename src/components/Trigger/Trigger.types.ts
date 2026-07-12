import type { ElementType, MouseEventHandler, ReactNode, Ref } from "react";

// Shared trigger wrapper props. `primitive` is the Radix *.Trigger component to
// render with `asChild`, so the consumer's own element becomes the trigger.
export interface TriggerProps {
  primitive: ElementType;
  children: ReactNode;
  className?: string;
  // Forwarded to the underlying trigger element (DropdownMenu uses it to measure on open).
  triggerRef?: Ref<HTMLButtonElement | null>;
  // Composed with the primitive's own handler — Tooltip uses it for tap-to-toggle on touch.
  onClick?: MouseEventHandler<HTMLElement>;
}
