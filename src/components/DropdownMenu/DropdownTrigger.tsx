"use client";

import { JSX, useContext } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import Trigger from "@/components/Trigger";
import type { DropdownTriggerProps } from "@/interfaces/dropdown-menu";
import { TriggerRefCtx } from "@/components/DropdownMenu/DropdownMenu";

// Trigger — attaches the shared ref so DropdownMenu can measure it on open.
export function DropdownTrigger({ children, className }: DropdownTriggerProps): JSX.Element {
  const ref = useContext(TriggerRefCtx);

  return (
    <>
      <Trigger primitive={Radix.Trigger} triggerRef={ref} className={className}>
        {children}
      </Trigger>
    </>
  );
}

DropdownTrigger.displayName = "DropdownTrigger";
