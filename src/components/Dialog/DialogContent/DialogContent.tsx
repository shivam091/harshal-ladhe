"use client";

import { JSX } from "react";
import * as Radix from "@radix-ui/react-dialog";
import type { DialogContentProps } from "@/interfaces/dialog";
import {
  overlayClass,
  contentClass,
  largeContentClass
} from "@/components/Dialog/DialogContent/DialogContent.styles";

// Content — the centered modal panel; renders the dimmed overlay behind it via a single Portal.
export function DialogContent({
  children,
  size = "default",
  className,
  "aria-label": ariaLabel
}: DialogContentProps): JSX.Element {
  return (
    <>
      <Radix.Portal>
        <Radix.Overlay className={overlayClass} />
        <Radix.Content
          aria-label={ariaLabel}
          className={[contentClass, size === "large" && largeContentClass, className]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </Radix.Content>
      </Radix.Portal>
    </>
  );
}

DialogContent.displayName = "DialogContent";
