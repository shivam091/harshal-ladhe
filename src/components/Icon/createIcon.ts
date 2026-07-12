import type { SVGProps } from "react";
import { createElement, forwardRef, JSX } from "react";
import Icon from "@/components/Icon/Icon";
import { icons } from "@/icons/icons";
import type { IconName } from "@/types/icon";

/*
  Factory that builds a named, forwarded-ref SVG component from an icons-registry entry.
  Accepts (and discards) isBooped so it's a harmless no-op to pass to any generic icon —
  e.g. Button.tsx injects it into every boxed icon without needing to know which ones,
  like IconArrowDown/IconArrowRight, actually animate in response to it.
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
