import type { ElementType, ComponentPropsWithoutRef } from "react";

// Polymorphic so hidden text can use whichever element keeps the surrounding markup valid.
export type VisuallyHiddenProps<T extends ElementType = "span"> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;
