import type { ButtonHTMLAttributes } from "react";

/*
  Props for the shared dismiss ("✕") button — `onClose` fires after the press-to-close hold
  (see usePressToClose), `label` is the VisuallyHidden text (aria-label stays "Dismiss" for
  every caller). Everything else (className, data-mobile-only, ...) passes through to the
  underlying <button> so each caller can still position/scope it as needed.
*/
export interface DismissButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "aria-label" | "onClick" | "onPointerDown" | "onPointerLeave" | "onPointerEnter" | "children"> {
  onClose: () => void;
  label?: string;
}
