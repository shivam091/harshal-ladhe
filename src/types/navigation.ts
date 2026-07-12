import type { AnalyticsEvent } from "./analytics";
import type { ThemeOption } from "./color-scheme";
import type { IconName } from "./icon";

// A single navigation link — href and title required; icon and external are optional.
export type NavItem = {
  href: string;
  title: string;
  icon?: IconName;
  external?: boolean;
};

// A theme-switcher option — key maps to data-theme, icon to the icon registry, label for display.
export type ColorScheme = {
  key: ThemeOption;
  label: string;
  icon: IconName;
  description?: string;
};

// A social/contact/feed link with optional external flag and analytics tracking payload.
export type SocialLink = {
  type: "github" | "linkedin" | "instagram" | "email" | "resume" | "atom";
  label: string;
  icon: IconName;
  href: string;
  external?: boolean;
  analytics?: AnalyticsEvent;
};
