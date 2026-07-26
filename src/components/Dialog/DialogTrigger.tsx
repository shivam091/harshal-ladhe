"use client";

import { JSX } from "react";
import * as Radix from "@radix-ui/react-dialog";
import Trigger from "@/components/Trigger";
import type { DialogTriggerProps } from "@/interfaces/dialog";

// Trigger — the consumer's own element becomes the trigger via Radix asChild.
export function DialogTrigger({ children, className }: DialogTriggerProps): JSX.Element {
  return (
    <>
      <Trigger primitive={Radix.Trigger} className={className}>
        {children}
      </Trigger>
    </>
  );
}

DialogTrigger.displayName = "DialogTrigger";
