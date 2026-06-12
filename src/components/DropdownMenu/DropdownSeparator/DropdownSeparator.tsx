"use client";

import type { JSX } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import { separatorClass } from "@/components/DropdownMenu/DropdownSeparator/DropdownSeparator.styles";

// Groups related items visually without adding a stop to keyboard navigation.
export default function DropdownSeparator(): JSX.Element {
  return (
    <>
      <Radix.Separator className={separatorClass} />
    </>
  );
}

DropdownSeparator.displayName = "DropdownSeparator";
