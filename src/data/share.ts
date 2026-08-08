import type { IconName } from "@/icons/icons";

// Shape of a single entry in the sharePlatforms array consumed by ShareBar.
interface SharePlatform {
  // Human-readable platform name shown in the Tooltip and aria-label ("X (Twitter)", etc.).
  type: string;
  // Icon identifier resolved by the Icon component.
  icon: IconName;
  // Factory that builds the platform-specific share URL from pre-encoded title and URL strings.
  buildHref: (title: string, url: string) => string;
}

/*
  Platform share link definitions consumed by ShareBar.
  Each entry provides a display type, an icon name, and a buildHref factory that
  accepts pre-encoded title and URL strings and returns the platform's share URL.
  Platforms that don't use the title (Facebook, Telegram, LinkedIn, WhatsApp) ignore
  the first argument via `_`.
*/
export const sharePlatforms: SharePlatform[] = [
  {
    type: "X (Twitter)",
    icon: "twitter",
    buildHref: (title, url) => `https://x.com/intent/tweet?text=${title}&url=${url}`
  },
  {
    // Facebook's sharer only accepts a URL; the title is populated by the page's OG tags.
    type: "Facebook",
    icon: "facebook",
    buildHref: (_, url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`
  },
  {
    type: "Telegram",
    icon: "telegram",
    buildHref: (_, url) => `https://t.me/share/url?url=${url}`
  },
  {
    type: "LinkedIn",
    icon: "linkedin",
    buildHref: (_, url) => `https://www.linkedin.com/shareArticle?mini=true&url=${url}`
  },
  {
    type: "WhatsApp",
    icon: "whatsapp",
    buildHref: (_, url) => `https://wa.me/?text=${url}`
  },
  {
    type: "Email",
    icon: "envelope",
    buildHref: (title, url) => `mailto:?subject=${title}&body=Check%20this%20out:%20${url}`
  }
];
