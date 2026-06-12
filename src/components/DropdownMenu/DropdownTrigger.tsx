"use client";

import type { JSX} from "react";
import { useContext } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import Trigger from "@/components/Trigger";
import type { DropdownTriggerProps } from "@/components/DropdownMenu/DropdownMenu.types";
import { TriggerRefCtx } from "@/components/DropdownMenu/DropdownMenu";

// Registers its ref so the menu can measure it and pick the roomiest side on open.
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
