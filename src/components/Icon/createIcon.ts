import type { SVGProps } from "react";
import { createElement, forwardRef, JSX } from "react";
import Icon from "@/components/Icon/Icon";
import { icons } from "@/icons/icons";
import type { IconName } from "@/icons/icons";

/*
  Swallows isBooped so any icon can safely receive it — a parent can pass it to every icon without
  knowing which ones actually animate, and it never leaks onto the DOM as an unknown attribute.
*/
const createIcon = (name: IconName) => {
  const Component = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement> & { size?: number; isBooped?: boolean }>(
    ({ className, size, name: _name, isBooped: _isBooped, ...props }, ref) => {
      return createElement(Icon, {
        ref,
        name,
        size,
        iconNode: icons[name].children,
        className,
        ...props
      });
    }
  );

  Component.displayName = name.charAt(0).toUpperCase() + name.slice(1);
  return Component;
};

export default createIcon;
