import type { ElementType } from "react";

// Shared animated tip props. `arrow` is the Radix *.Arrow primitive (dropdown or
// tooltip); `isOpen` drives the flat → curved spring.
export interface TipProps {
  arrow: ElementType;
  isOpen: boolean;
}
