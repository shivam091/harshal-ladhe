"use client";

import type { JSX, RefObject} from "react";
import { createContext, useCallback, useMemo, useRef, useState } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import type { DropdownMenuProps, DropdownCtxType, Side } from "@/components/DropdownMenu/DropdownMenu.types";
import { computeSide } from "@/components/DropdownMenu/DropdownMenu.helpers";

// isOpen drives the tip spring; autoSide is the measured best side when side="auto".
export const DropdownCtx = createContext<DropdownCtxType>({ isOpen: false, autoSide: "bottom" });

// Carries the trigger's DOM ref down to DropdownTrigger for measurement on open.
export const TriggerRefCtx = createContext<RefObject<HTMLButtonElement | null>>({ current: null });

// Root — owns open state, measures the trigger on open, and provides both contexts.
export function DropdownMenu({ children, modal = false }: DropdownMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [autoSide, setAutoSide] = useState<Side>("bottom");
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleOpenChange = useCallback((next: boolean) => {
    if (next && triggerRef.current) {
      setAutoSide(computeSide(triggerRef.current.getBoundingClientRect()));
    }
    setOpen(next);
  }, []);

  // Stable identity so DropdownTip/DropdownContent only re-render when isOpen or autoSide actually change.
  const ctxValue = useMemo<DropdownCtxType>(() => ({ isOpen: open, autoSide }), [open, autoSide]);

  return (
    <>
      <DropdownCtx.Provider value={ctxValue}>
        <TriggerRefCtx.Provider value={triggerRef}>
          <Radix.Root open={open} onOpenChange={handleOpenChange} modal={modal}>
            {children}
          </Radix.Root>
        </TriggerRefCtx.Provider>
      </DropdownCtx.Provider>
    </>
  );
}

DropdownMenu.displayName = "DropdownMenu";
