"use client";

import type { JSX } from "react";
import { usePressToClose } from "@/hooks/use-press-to-close";
import { useBoop } from "@/hooks/use-boop";
import IconDismiss from "@/icons/IconDismiss";
import VisuallyHidden from "@/components/VisuallyHidden";
import type { DismissButtonProps } from "@/components/DismissButton/DismissButton.types";

/*
  Shared ✕ button — press-to-close morph (usePressToClose) plus a boop-on-hover icon.
*/
export default function DismissButton({ onClose, label = "Dismiss", ...rest }: DismissButtonProps): JSX.Element {
  const closePress = usePressToClose(onClose);
  const [isBooped, triggerBoop] = useBoop();

  return (
    <>
      <button
        type="button"
        aria-label="Dismiss"
        onPointerEnter={triggerBoop}
        onPointerDown={closePress.onPointerDown}
        onClick={closePress.onClick}
        onPointerLeave={closePress.onPointerLeave}
        {...rest}
      >
        <IconDismiss size={16} isPressed={closePress.isPressed} isBooped={isBooped} />
        <VisuallyHidden>{label}</VisuallyHidden>
      </button>
    </>
  );
}

DismissButton.displayName = "DismissButton";
