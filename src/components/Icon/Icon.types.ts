import type { SVGProps, JSX } from "react";
import type { IconName } from "@/icons/icons";

// Extends SVGProps with size and an optional pre-resolved node; name is required for registry lookup.
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  /** Explicit SVG children — when omitted, resolved from the icons registry via name. */
  iconNode?: JSX.Element;
  name: IconName;
}
