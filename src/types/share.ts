import type { IconName } from "@/types/icon";

// Shape of a single entry in the sharePlatforms array consumed by ShareBar.
export interface SharePlatform {
  // Human-readable platform name shown in the Tooltip and aria-label ("X (Twitter)", etc.).
  type: string;
  // Icon identifier resolved by the Icon component.
  icon: IconName;
  // Factory that builds the platform-specific share URL from pre-encoded title and URL strings.
  buildHref: (title: string, url: string) => string;
}
