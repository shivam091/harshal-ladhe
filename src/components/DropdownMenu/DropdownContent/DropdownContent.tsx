"use client";

import { JSX, useContext } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import type { DropdownContentProps } from "@/interfaces/dropdown-menu";
import { DropdownCtx } from "@/components/DropdownMenu/DropdownMenu";
import { DropdownTip } from "@/components/DropdownMenu/DropdownTip";
import { contentClass, ContentInner } from "@/components/DropdownMenu/DropdownContent/DropdownContent.styles";

// Content — the floating panel; resolves "auto" to a measured side at open time.
export default function DropdownContent({
  children,
  side = "auto",
  align = "end",
  sideOffset = 16,
  className,
  "aria-label": ariaLabel
}: DropdownContentProps): JSX.Element {
  const { autoSide } = useContext(DropdownCtx);
  const resolvedSide = side === "auto" ? autoSide : side;

  return (
    <>
      <Radix.Portal>
        <Radix.Content
          side={resolvedSide}
          align={align}
          sideOffset={sideOffset}
          aria-label={ariaLabel}
          className={[contentClass, className].filter(Boolean).join(" ")}
        >
          <DropdownTip />
          <ContentInner>{children}</ContentInner>
        </Radix.Content>
      </Radix.Portal>
    </>
  );
}

DropdownContent.displayName = "DropdownContent";
