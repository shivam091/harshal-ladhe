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

// Props for the floating modal panel — renders the dimmed overlay plus the centered content chrome.
export interface DialogContentProps {
  children: ReactNode;
  // Width tier — "default" caps at a comfortable reading measure, "large" gives content that
  // needs to lay out side-by-side (e.g. a multi-column grid) more room.
  size?: "default" | "large";
  className?: string;
  "aria-label"?: string;
  /*
    Portal target — defaults to document.body via Radix. Pass the fullscreened element itself
    (see Sandbox's wrapperRef) while it's browser-fullscreened, since a fullscreened element's
    top layer sits above document.body's normal stacking context regardless of z-index, which
    would otherwise hide this dialog behind it.
  */
  container?: HTMLElement | null;
}

// Props for the accessible name Radix announces when the dialog opens.
export interface DialogTitleProps {
  children: ReactNode;
  // Renders through to `children` instead of wrapping it in Radix's default <h2> — on by default
  // since callers almost always supply their own styled heading.
  asChild?: boolean;
}

// Props for the accessible description Radix links via aria-describedby. Wrap in VisuallyHidden
// when the dialog has no visible summary text.
export interface DialogDescriptionProps {
  children: ReactNode;
  asChild?: boolean;
}

// Props for the dismiss control — wraps any element via Radix asChild.
export interface DialogCloseProps {
  children: ReactNode;
  className?: string;
}
