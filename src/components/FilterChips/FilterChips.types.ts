import type { ComponentType, SVGProps } from "react";

// Generic over the value so any list (content types, years, tags) can filter with the same chips.
export interface FilterChipOption<T extends string> {
  value: T;
  label: string;
  // Optional so text-only chips work too; sized and hidden from screen readers by the chip itself.
  Icon?: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  // Total items for this value, unaffected by the current selection, so readers know what a chip hides.
  count?: number;
  // Keeps an empty option visible but inert, so every list shows the same set of chips.
  disabled?: boolean;
}

// Controlled so the owning list decides what an empty or reset selection means.
export interface FilterChipsProps<T extends string> {
  options: FilterChipOption<T>[];
  selected: ReadonlySet<T>;
  onToggle: (value: T) => void;
  // Names the group for screen readers, e.g. "Filter archive by content type".
  ariaLabel: string;
}
