import type { ReactNode } from "react";

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
