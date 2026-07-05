import { siteConfig } from "@/config/site";
import type { AnalyticsEvent, IconName } from "@/icons/icons";
import type { ThemeOption } from "@/constants/color-scheme";

// One link shape for every nav surface so any list can be rendered anywhere.
export type NavItem = {
  href: string;
  title: string;
  icon?: IconName;
  external?: boolean;
};

// Keyed by ThemeOption so a menu entry can never name a theme that doesn't exist.
export type ColorScheme = {
  key: ThemeOption;
  label: string;
  icon: IconName;
  description?: string;
};

// Typed by kind so feeds and contact links can be treated differently from profiles.
export type SocialLink = {
  type: "github" | "linkedin" | "instagram" | "email" | "resume" | "atom";
  label: string;
  icon: IconName;
  href: string;
  external?: boolean;
  analytics?: AnalyticsEvent;
};

// Kept short so the primary nav fits the header without collapsing on mid-size screens.
export const mainNav: NavItem[] = [
  { href: "/about",   title: "About",   icon: "infoCircle" },
  { href: "/posts",   title: "Posts",   icon: "list"       },
  { href: "/goodies", title: "Goodies", icon: "candy"      }
];

// Useful but secondary destinations, kept out of the primary nav to keep it focused.
export const quickLinks: NavItem[] = [
  { href: "/how-did-i-build-my-blog", title: "About This Blog" },
  { href: "/contact",                 title: "Contact"         }
];

// Grouped apart so policy pages stay findable without competing with content links.
export const legalLinks: NavItem[] = [
  { href: "/terms-of-use",    title: "Terms of Use"    },
  { href: "/privacy-policy",  title: "Privacy Policy"  },
  { href: "/code-of-conduct", title: "Code of Conduct" }
];

// "System" comes first so respecting the OS preference reads as the default choice.
export const colorSchemes: ColorScheme[] = [
  { key: "system",    label: "System",    icon: "deviceDesktop", description: "Use your system’s default theme" },
  { key: "light",     label: "Light",     icon: "sun",           description: "Use light mode"                  },
  { key: "soft-dark", label: "Soft Dark", icon: "sunDim",        description: "Use soft dark mode"              },
  { key: "dark",      label: "Dark",      icon: "moon",          description: "Use dark mode"                   }
];

// Built from siteConfig so profile URLs are defined once.
export const socialLinks: SocialLink[] = [
  {
    type:      "github",
    label:     "GitHub",
    icon:      "github",
    href:      siteConfig.author.social.github,
    external:  true,
    analytics: { event: "social_click", label: "GitHub",    category: "social" }
  },
  {
    type:      "linkedin",
    label:     "LinkedIn",
    icon:      "linkedin",
    href:      siteConfig.author.social.linkedin,
    external:  true,
    analytics: { event: "social_click", label: "LinkedIn",  category: "social" }
  },
  {
    type:      "instagram",
    label:     "Instagram",
    icon:      "instagram",
    href:      siteConfig.author.social.instagram,
    external:  true,
    analytics: { event: "social_click", label: "Instagram", category: "social" }
  },
  {
    type:      "email",
    label:     "Email",
    icon:      "envelope",
    href:      `mailto:${siteConfig.author.email}`,
    analytics: { event: "social_click", label: "Email",     category: "social" }
  },
  {
    type:      "resume",
    label:     "Resume",
    icon:      "file",
    href:      siteConfig.author.resume,
    external:  true,
    analytics: {
      event:    "download_resume",
      label:    "resume.pdf",
      category: "engagement"
    }
  },
  {
    type:      "atom",
    label:     "Atom Feed",
    icon:      "rss",
    href:      "/atom.xml",
    analytics: {
      event:    "subscribe_feed",
      label:    "Atom Feed",
      category: "engagement"
    }
  }
];
