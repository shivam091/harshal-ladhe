import type { ButtonHTMLAttributes } from "react";

/*
  `onClose` fires after the press-to-close hold so the ✕'s flatten is seen first. Everything else
  passes through to the <button> so each placement can still position or scope it.
*/
export interface DismissButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "aria-label" | "onClick" | "onPointerDown" | "onPointerLeave" | "onPointerEnter" | "children"> {
  onClose: () => void;
  label?: string;
}
