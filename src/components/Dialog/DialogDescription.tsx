"use client";

import type { JSX } from "react";
import * as Radix from "@radix-ui/react-dialog";
import type { DialogDescriptionProps } from "@/components/Dialog/Dialog.types";

/*
  Description — the accessible summary Radix links via aria-describedby; renders through to the
  caller's own element by default (often VisuallyHidden when there's no visible summary text).
*/
export function DialogDescription({ children, asChild = true }: DialogDescriptionProps): JSX.Element {
  return (
    <>
      <Radix.Description asChild={asChild}>{children}</Radix.Description>
    </>
  );
}

DialogDescription.displayName = "DialogDescription";
