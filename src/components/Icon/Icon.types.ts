import type { SVGProps, JSX } from "react";
import type { IconName } from "@/icons/icons";

// name stays required even alongside iconNode because it also drives the per-icon class name.
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  /** Skips the registry lookup when the caller already holds the resolved children. */
  iconNode?: JSX.Element;
  name: IconName;
}
