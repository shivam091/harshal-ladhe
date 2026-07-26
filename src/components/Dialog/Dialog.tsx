"use client";

import { JSX } from "react";
import * as Radix from "@radix-ui/react-dialog";
import type { DialogProps } from "@/interfaces/dialog";

// Root — owns open state (controlled or uncontrolled) and renders no DOM of its own.
export function Dialog({ children, open, defaultOpen, onOpenChange, modal }: DialogProps): JSX.Element {
  return (
    <>
      <Radix.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
        {children}
      </Radix.Root>
    </>
  );
}

Dialog.displayName = "Dialog";
