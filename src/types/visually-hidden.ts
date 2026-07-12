import type { ElementType, ComponentPropsWithoutRef } from "react";

// Props for VisuallyHidden — accepts an optional `as` polymorphic tag plus all native element props for that tag.
export type VisuallyHiddenProps<T extends ElementType = "span"> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;
