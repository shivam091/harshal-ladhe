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
    Pass the fullscreened element while browser-fullscreened, since its top layer sits above
    document.body's stacking context regardless of z-index and would otherwise hide the dialog.
  */
  container?: HTMLElement | null;
}
