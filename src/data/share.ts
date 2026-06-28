import type { IconName } from "@/icons/icons";

// Each platform supplies its own URL builder because share endpoints differ in which params they take.
interface SharePlatform {
  // Human-readable so it doubles as the tooltip and accessible label.
  type: string;
  // Typed to the icon registry so a misspelt name fails at build time.
  icon: IconName;
  // Takes pre-encoded strings so encoding happens once rather than in every builder.
  buildHref: (title: string, url: string) => string;
}

// Data-driven so adding a platform is one entry, not a new share component.
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
