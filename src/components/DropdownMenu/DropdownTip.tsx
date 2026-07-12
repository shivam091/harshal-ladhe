"use client";

import type { JSX} from "react";
import { useContext } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import Tip from "@/components/Tip";
import { DropdownCtx } from "@/components/DropdownMenu/DropdownMenu";

// Animated SVG arrow that springs from a flat line to a curved hill as the panel opens.
export function DropdownTip(): JSX.Element {
  const { isOpen } = useContext(DropdownCtx);

  return (
    <>
      <Tip arrow={Radix.Arrow} isOpen={isOpen} />
    </>
  );
}

DropdownTip.displayName = "DropdownTip";
