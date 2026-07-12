import type { SVGProps, JSX } from "react";
import type { IconName } from "@/types/icon";
import type { AnalyticsEvent } from "@/types/analytics";

// Extends SVGProps with size and an optional pre-resolved node; name is required for registry lookup.
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  /** Explicit SVG children — when omitted, resolved from the icons registry via name. */
  iconNode?: JSX.Element;
  name: IconName;
}

// Atom feed link props — mirrors the relevant fields from SocialLink.
export interface IconRssLinkProps {
  href?: string;
  size?: number;
  label?: string;
  className?: string;
  analytics?: AnalyticsEvent;
}

// Resume/file link props — mirrors the relevant fields from SocialLink.
export interface IconFileLinkProps {
  href?: string;
  size?: number;
  label?: string;
  className?: string;
  external?: boolean;
  analytics?: AnalyticsEvent;
}

// Email link props — mirrors the relevant fields from SocialLink.
export interface IconEnvelopeLinkProps {
  href?: string;
  size?: number;
  label?: string;
  className?: string;
  analytics?: AnalyticsEvent;
}
