"use client";

import type { JSX } from "react";
import type { FilterChipsProps } from "@/components/FilterChips/FilterChips.types";
import { FilterRow, FilterChip, FilterChipCount } from "@/components/FilterChips/FilterChips.styles";

// Toggle buttons rather than checkboxes so each chip announces its own pressed state.
export default function FilterChips<T extends string>({
  options,
  selected,
  onToggle,
  ariaLabel
}: FilterChipsProps<T>): JSX.Element {
  return (
    <>
      <FilterRow role="group" aria-label={ariaLabel}>
        {options.map(({ value, label, Icon, count, disabled = false }) => (
          <FilterChip
            key={value}
            type="button"
            aria-pressed={!disabled && selected.has(value)}
            disabled={disabled}
            onClick={() => onToggle(value)}
          >
            {Icon && <Icon size={16} aria-hidden />}
            {label}
            {count !== undefined && <FilterChipCount>{count}</FilterChipCount>}
          </FilterChip>
        ))}
      </FilterRow>
    </>
  );
}

FilterChips.displayName = "FilterChips";
