"use client";

import type { JSX } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import { separatorClass } from "@/components/DropdownMenu/DropdownSeparator/DropdownSeparator.styles";

// Separator — a thin horizontal rule for visually grouping items.
export default function DropdownSeparator(): JSX.Element {
  return (
    <>
      <Radix.Separator className={separatorClass} />
    </>
  );
}

DropdownSeparator.displayName = "DropdownSeparator";
