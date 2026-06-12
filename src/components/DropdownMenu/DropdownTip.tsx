"use client";

import type { JSX} from "react";
import { useContext } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import Tip from "@/components/Tip";
import { DropdownCtx } from "@/components/DropdownMenu/DropdownMenu";

// Springs open with the panel so the arrow feels attached to it rather than popping in.
export function DropdownTip(): JSX.Element {
  const { isOpen } = useContext(DropdownCtx);

  return (
    <>
      <Tip arrow={Radix.Arrow} isOpen={isOpen} />
    </>
  );
}

DropdownTip.displayName = "DropdownTip";
