"use client";

import type { JSX } from "react";
import { useBoop } from "@/hooks/use-boop";
import type { AnalyticsEvent } from "@/icons/icons";
import IconFile from "@/icons/IconFile";

// Kept shape-compatible with social link entries so it can be rendered from the same data.
export interface IconFileLinkProps {
  href?: string;
  size?: number;
  label?: string;
  className?: string;
  external?: boolean;
  analytics?: AnalyticsEvent;
}

// Owns its boop state so hovering anywhere on the link animates the icon, not just the glyph.
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
