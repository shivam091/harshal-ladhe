import type { JSX } from "react";
import type { SelectProps } from "@/components/Select/Select.types";
import { SelectWrapper, SelectRoot } from "@/components/Select/Select.styles";

// Keeps native <select> semantics and keyboard behaviour while matching Button's size scale.
export default function Select({ size = "md", fullWidth = false, className, children, ...rest }: SelectProps): JSX.Element {
  return (
    <>
      <SelectWrapper data-fullwidth={fullWidth || undefined}>
        <SelectRoot className={className} data-size={size} {...rest}>
          {children}
        </SelectRoot>
      </SelectWrapper>
    </>
  );
}

Select.displayName = "Select";
