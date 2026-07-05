// Central site metadata — author info, URLs, font stack, and founding year consumed across components and SEO.
export const siteConfig = {
  // Display name used in OG metadata, the site header, and share previews.
  name: "Harshal V. LADHE",
  // Short tagline shown beneath the site name in hero / header contexts.
  tagline: "A showcase of my technical blog posts, coding insights, and open source projects.",
  // Longer bio used in OG description and the about section.
  description: "I'm a software engineer, freelancer, and lifelong learner passionate about building clean, scalable web solutions. I contribute to open-source, embrace minimalism in code and life, and stay curious about emerging tech.",
  // Canonical origin — used to build absolute URLs for OG tags, sitemaps, and share links.
  url: "https://harshal-ladhe.vercel.app",

  // BCP-47 language tag set on <html lang>.
  lang: "en",
  // IANA timezone used for date formatting and sitemap lastmod timestamps.
  timezone: "Asia/Kolkata",

  author: {
    name: "Harshal V. LADHE",
    // Rotating role labels displayed in animated hero text.
    roles: ["software engineer", "freelancer", "lifelong learner"],
    email: "harshal.ladhe.1@gmail.com",
    // Relative path to the downloadable résumé PDF served from /public.
    resume: "/resume.pdf",
    url: "https://harshal-ladhe.vercel.app",
    social: {
      github: "https://github.com/shivam091",
      linkedin: "https://www.linkedin.com/in/shivam091",
      instagram: "http://instagram.com/taurusian_soul"
    }
  },

  // Year the site launched — used in the footer copyright range (foundedYear–present).
  foundedYear: 2026,

  verification: {
    // Google Search Console ownership token injected into <head> via Next.js metadata.
    google: [
      "hTBhtR_jnBb5Cua7vHU-6J3unFg6ADgRtGv1oaJeuVg"
    ]
  },

  // Google Fonts stylesheet URL — loaded in the root layout for the site's type stack.
  font_url: "https://fonts.googleapis.com/css2?family=Alan+Sans:wght@300..900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&family=Source+Code+Pro:wght@200..900&display=swap",

  analytics: {
    // Google Analytics 4 measurement ID injected by the Analytics component.
    googleMeasurementId: "G-R5EZ91PMYX"
  },

  readTime: {
    // Average adult silent reading speed used to estimate snippet read times.
    wordsPerMinute: 180
  },

  // Related-posts block shown at the end of each post. Posts are ranked by
  // tag/category overlap (Jaccard similarity), weighted per the scores below.
  relatedPosts: {
    // Set false to hide the related-posts section site-wide.
    enabled: true,
    // Maximum number of related posts to surface.
    limit: 3,
    // Weight applied to the shared-tags similarity score.
    tagWeight: 1.0,
    // Weight applied to the shared-categories similarity score.
    categoryWeight: 0.5,
    // Top up with recent posts (registry order) when too few share tags/categories.
    fallbackToRecent: true
  },

  // When true, renders the retro LED hit counter at the bottom of each post/snippet/series page.
  hitCounter: true,

  // Home page sections. Each block can be toggled off, and empty sections hide
  // themselves regardless. Port of the Jekyll home generators' `_config.yml`.
  home: {
    // Posts flagged `pinned: true` in the registry, surfaced first.
    pinnedPosts: {
      enabled: true,
    },
    // Posts flagged `featured: true` in the registry.
    featuredPosts: {
      enabled: true,
    },
    // Tags ranked by recency-weighted frequency across recently-updated posts.
    trendingTags: {
      enabled: true,
      // Maximum number of tags to surface.
      limit: 10,
      // How many recently-updated posts feed the ranking window.
      maxPosts: 15,
      // Recency decay applied to each post's contribution: "exponential", "log", or "linear".
      decayStrategy: "exponential" as "exponential" | "log" | "linear",
      // Scale scores to 0–100 so the top tag always reads 100.
      normalization: true,
    },
    // Categories ranked by total post count.
    popularCategories: {
      enabled: true,
      // Maximum number of categories to surface.
      limit: 5,
    },
    // Posts ordered by last-modified date, newest first.
    recentlyUpdatedPosts: {
      enabled: true,
      // Maximum number of posts to surface.
      limit: 5,
    },
  }
};

// Inferred type of siteConfig — use when a function parameter needs the full config shape.
export type SiteConfig = typeof siteConfig;
