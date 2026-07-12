"use client";

import { JSX } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import { DropdownLabelProps } from "@/interfaces/dropdown-menu";
import { labelClass } from "@/components/DropdownMenu/DropdownLabel/DropdownLabel.styles";

// Label — a non-interactive heading row for a group of items.
export default function DropdownLabel({ children, className }: DropdownLabelProps): JSX.Element {
  return (
    <>
      <Radix.Label className={[labelClass, className].filter(Boolean).join(" ")}>
        {children}
      </Radix.Label>
    </>
  );
}

DropdownLabel.displayName = "DropdownLabel";
