"use client";

import type { JSX } from "react";
import * as Radix from "@radix-ui/react-dialog";
import type { DialogTitleProps } from "@/components/Dialog/Dialog.types";

/*
  Title — the accessible name Radix announces when the dialog opens; renders through to the
  caller's own heading element by default instead of injecting an unstyled <h2>.
*/
export function DialogTitle({ children, asChild = true }: DialogTitleProps): JSX.Element {
  return (
    <>
      <Radix.Title asChild={asChild}>{children}</Radix.Title>
    </>
  );
}

DialogTitle.displayName = "DialogTitle";
