"use client";

import type { JSX } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import type { DropdownLabelProps } from "@/components/DropdownMenu/DropdownLabel/DropdownLabel.types";
import { labelClass } from "@/components/DropdownMenu/DropdownLabel/DropdownLabel.styles";

// Names a group of items without being focusable, so keyboard navigation skips over it.
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
