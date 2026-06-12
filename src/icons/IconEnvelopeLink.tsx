"use client";

import type { JSX } from "react";
import { useBoop } from "@/hooks/use-boop";
import type { AnalyticsEvent } from "@/icons/icons";
import IconEnvelope from "@/icons/IconEnvelope";

// Kept shape-compatible with social link entries so it can be rendered from the same data.
export interface IconEnvelopeLinkProps {
  href?: string;
  size?: number;
  label?: string;
  className?: string;
  analytics?: AnalyticsEvent;
}

// Owns its boop state so hovering anywhere on the link animates the icon, not just the glyph.
export default function IconEnvelopeLink({
  href,
  size = 18,
  label = "Email",
  className,
  analytics
}: IconEnvelopeLinkProps): JSX.Element {
  const [isBooped, triggerBoop] = useBoop();

  return (
    <>
      <a
        href={href}
        className={className}
        aria-label={label}
        onPointerEnter={triggerBoop}
        {...(analytics ? {
          "data-analytics-event":    analytics.event,
          "data-analytics-label":    analytics.label,
          "data-analytics-category": analytics.category
        } : {})}
      >
        <IconEnvelope size={size} isBooped={isBooped} />
      </a>
    </>
  );
}

IconEnvelopeLink.displayName = "IconEnvelopeLink";
