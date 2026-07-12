"use client";

import { JSX } from "react";
import { useBoop } from "@/hooks/use-boop";
import { IconEnvelopeLinkProps } from "@/interfaces/icon";
import IconEnvelope from "@/icons/IconEnvelope";

// Self-contained email link — owns boop state and renders the animated icon.
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
