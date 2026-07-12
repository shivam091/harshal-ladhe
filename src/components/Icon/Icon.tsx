import type { JSX } from "react";
import { createElement, forwardRef } from "react";
import { hyphenate } from "@/utils/string";
import defaultAttributes from "@/components/Icon/defaultAttributes";
import type { IconDefinition } from "@/types/icon";
import { icons } from "@/icons/icons";
import type { IconProps } from "@/interfaces/icon";

// Generic SVG icon — resolves children and viewBox from the icons registry by name, or accepts an explicit iconNode.
const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { size, className, iconNode, name, ...props },
  ref
): JSX.Element {
  const iconClass = `icon-${hyphenate(name)}`;

  // Cast to IconDefinition so svgProps (which is optional) is visible to TS.
  const def = icons[name] as IconDefinition | undefined;
  const resolvedNode = iconNode ?? <>{def?.children}</>;
  const defProps = def?.svgProps ?? {};
  const viewBox = (props.viewBox ?? def?.viewBox) || defaultAttributes.viewBox;

  return createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      ...defProps,
      viewBox,
      width: size || defaultAttributes.width,
      height: size || defaultAttributes.height,
      className: `${iconClass} ${className || ""}`.trim(),
      ...props
    },
    resolvedNode
  );
});

Icon.displayName = "Icon";
export default Icon;
