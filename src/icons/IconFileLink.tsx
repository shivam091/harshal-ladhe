"use client";

import type { JSX } from "react";
import { useBoop } from "@/hooks/use-boop";
import type { IconFileLinkProps } from "@/interfaces/icon";
import IconFile from "@/icons/IconFile";

// Self-contained resume link — owns boop state and renders the animated icon.
export default function IconFileLink({
  href,
  size = 18,
  label = "Resume",
  className,
  external,
  analytics
}: IconFileLinkProps): JSX.Element {
  const [isBooped, triggerBoop] = useBoop();

  return (
    <>
      <a
        href={href}
        className={className}
        aria-label={external ? `${label} (opens in new tab)` : label}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onPointerEnter={triggerBoop}
        {...(analytics ? {
          "data-analytics-event":    analytics.event,
          "data-analytics-label":    analytics.label,
          "data-analytics-category": analytics.category
        } : {})}
      >
        <IconFile size={size} isBooped={isBooped} />
      </a>
    </>
  );
}

IconFileLink.displayName = "IconFileLink";
