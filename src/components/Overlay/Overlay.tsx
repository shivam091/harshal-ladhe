"use client";

import type { JSX } from "react";
import type { OverlayProps } from "@/components/Overlay/Overlay.types";
import { Overlay as OverlayRoot } from "@/components/Overlay/Overlay.styles";

/*
  Shared position:absolute;inset:0 cover for a position:relative parent — e.g. PreviewPanel's Pane.
  Consumers (PreviewLoadingOverlay, PreviewErrorOverlay, ...) only pick tone/align and supply their
  own content.
*/
export default function Overlay({ role, tone = "default", align = "center", children }: OverlayProps): JSX.Element {
  return (
    <>
      <OverlayRoot role={role} aria-live={role === "status" ? "polite" : undefined} data-tone={tone} data-align={align}>
        {children}
      </OverlayRoot>
    </>
  );
}

Overlay.displayName = "Overlay";
