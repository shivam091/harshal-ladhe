// Mirrors Button's sm/md/lg scale so paired controls step up together.
export type SelectSize = "sm" | "md" | "lg";

// Which side of the trigger the listbox opens on, so it never runs off the bottom of the viewport.
export type SelectSide = "top" | "bottom";

// A plain-string label keeps type-to-jump matching possible, the way a native select allows.
export interface SelectOption<T extends string> {
  // Value handed back through onValueChange.
  value: T;
  // Visible text, also matched against typed characters.
  label: string;
  // Shown but not choosable.
  disabled?: boolean;
}

// Controlled-only, so the caller always owns which option is current.
export interface SelectProps<T extends string> {
  // Choices, in display order.
  options: SelectOption<T>[];
  // Current value; null shows the placeholder instead.
  value: T | null;
  // Fires only when a different option is chosen.
  onValueChange: (value: T) => void;
  // Trigger text while nothing is selected. Default: `"Select…"`
  placeholder?: string;
  // Block-size/font-size scale. Default: `"md"`
  size?: SelectSize;
  // Stretches the select to 100% of its container.
  fullWidth?: boolean;
  // Blocks opening and dims the trigger.
  disabled?: boolean;
  // Id for the trigger, so an external <label htmlFor> can point at it.
  id?: string;
  // Extra class on the outer wrapper.
  className?: string;
  // Accessible name when there's no visible label.
  "aria-label"?: string;
  // Id of a visible label element.
  "aria-labelledby"?: string;
}
