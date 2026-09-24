import type { SelectHTMLAttributes } from "react";

// Mirrors Button's sm/md/lg scale so paired controls step up together.
export type SelectSize = "sm" | "md" | "lg";

// Omits the native numeric `size` (visible rows) so the name can carry the visual scale instead.
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  // Block-size/font-size scale. Default: `"md"`
  size?: SelectSize;
  // Stretches the select to 100% of its container.
  fullWidth?: boolean;
}
