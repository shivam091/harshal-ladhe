"use client";

import { JSX } from "react";
import * as Radix from "@radix-ui/react-dialog";
import type { DialogCloseProps } from "@/interfaces/dialog";

// Close — dismisses the dialog when the wrapped element is activated.
export function DialogClose({ children, className }: DialogCloseProps): JSX.Element {
  return (
    <>
      <Radix.Close asChild className={className}>
        {children}
      </Radix.Close>
    </>
  );
}

DialogClose.displayName = "DialogClose";
