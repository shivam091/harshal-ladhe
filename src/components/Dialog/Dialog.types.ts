import type { ReactNode } from "react";

// Props for the root wrapper — owns open state, controlled or uncontrolled, per Radix Dialog.Root.
export interface DialogProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Traps focus and inerts the rest of the page while open — Radix defaults this to true.
  modal?: boolean;
}

// Props for the trigger slot — wraps any focusable element via Radix asChild.
export interface DialogTriggerProps {
  children: ReactNode;
  className?: string;
}

// Props for the accessible name Radix announces when the dialog opens.
export interface DialogTitleProps {
  children: ReactNode;
  // Renders through to `children` instead of wrapping it in Radix's default <h2> — on by default
  // since callers almost always supply their own styled heading.
  asChild?: boolean;
}

// Accessible description Radix links via aria-describedby; wrap in VisuallyHidden when there's no visible summary.
export interface DialogDescriptionProps {
  children: ReactNode;
  asChild?: boolean;
}

// Props for the dismiss control — wraps any element via Radix asChild.
export interface DialogCloseProps {
  children: ReactNode;
  className?: string;
}
