"use client";

import type { JSX } from "react";
import { useBoop } from "@/hooks/use-boop";
import type { AnalyticsEvent } from "@/icons/icons";
import IconRss from "@/icons/IconRss";

// Atom feed link props — mirrors the relevant fields from SocialLink.
export interface IconRssLinkProps {
  href?: string;
  size?: number;
  label?: string;
  className?: string;
  analytics?: AnalyticsEvent;
}

// Self-contained Atom feed link — owns boop state and renders the animated icon.
export default function IconRssLink({
  href = "/atom.xml",
  size = 16,
  label = "Atom Feed",
  className,
  analytics
}: IconRssLinkProps): JSX.Element {
  const [isBooped, triggerBoop] = useBoop();

  return (
    <>
      <a
        href={href}
        className={className}
        aria-label={`${label} (opens in new tab)`}
        target="_blank"
        rel="alternate noopener noreferrer"
        type="application/atom+xml"
        onPointerEnter={triggerBoop}
        {...(analytics ? {
          "data-analytics-event":    analytics.event,
          "data-analytics-label":    analytics.label,
          "data-analytics-category": analytics.category
        } : {})}
      >
        <IconRss size={size} isBooped={isBooped} />
      </a>
    </>
  );
}

IconRssLink.displayName = "IconRssLink";
