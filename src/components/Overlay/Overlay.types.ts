import type { ReactNode } from "react";

// Props for the shared Overlay — a position:absolute cover for a position:relative parent.
export interface OverlayProps {
  role: "status" | "alert";
  tone?: "default" | "danger";
  align?: "center" | "start";
  children: ReactNode;
}
