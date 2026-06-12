import type { ElementType, MouseEventHandler, ReactNode, Ref } from "react";

// Takes the Trigger primitive as a prop so one wrapper works across different Radix overlays.
export interface TriggerProps {
  primitive: ElementType;
  children: ReactNode;
  className?: string;
  // Exposed for overlays that need the trigger's size to position or size themselves.
  triggerRef?: Ref<HTMLButtonElement | null>;
  // Composed with, not replacing, the primitive's handler — needed for tap-to-toggle on touch, where hover never fires.
  onClick?: MouseEventHandler<HTMLElement>;
}
