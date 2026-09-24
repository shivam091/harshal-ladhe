import type { ButtonHTMLAttributes } from "react";

// Omits type and children because the button's role and icon are fixed; only interaction props remain.
export type PlayButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children">;
