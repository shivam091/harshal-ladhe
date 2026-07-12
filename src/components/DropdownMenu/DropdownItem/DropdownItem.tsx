"use client";

import type { JSX } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import type { DropdownItemProps } from "@/components/DropdownMenu/DropdownItem/DropdownItem.types";
import { itemClass } from "@/components/DropdownMenu/DropdownItem/DropdownItem.styles";

// Keeps every row's styling consistent while letting toggle-style items opt out of closing the menu.
export default function DropdownItem({
  children,
  onSelect,
  className,
  disabled,
  role,
  "aria-checked": ariaChecked,
  preventAutoClose,
  onPointerEnter,
  onFocus
}: DropdownItemProps): JSX.Element {
  return (
    <>
      <Radix.Item
        onSelect={(event) => {
          if (preventAutoClose) event.preventDefault();
          onSelect?.();
        }}
        disabled={disabled}
        role={role}
        aria-checked={ariaChecked}
        className={[itemClass, className].filter(Boolean).join(" ")}
        onPointerEnter={onPointerEnter}
        onFocus={onFocus}
      >
        {children}
      </Radix.Item>
    </>
  );
}

DropdownItem.displayName = "DropdownItem";
