// Single source for site identity and settings so copy, SEO, and feature toggles change in one place.
export const siteConfig = {
  // Canonical display name, kept identical everywhere the site identifies itself.
  name: "Harshal V. LADHE",
  // One-line pitch for spots too tight for the full description.
  tagline: "A showcase of my technical blog posts, coding insights, and open source projects.",
  // Fuller bio for contexts with room to say more than the tagline.
  description: "I'm a software engineer, freelancer, and lifelong learner passionate about building clean, scalable web solutions. I contribute to open-source, embrace minimalism in code and life, and stay curious about emerging tech.",
  // Canonical origin so absolute URLs never depend on the request host or a preview deployment.
  url: "https://harshal-ladhe.vercel.app",

  // BCP-47 tag so screen readers and translators apply the right language rules.
  lang: "en",
  // Pinned so dates render identically regardless of the build server's or visitor's timezone.
  timezone: "Asia/Kolkata",

  author: {
    name: "Harshal V. LADHE",
    // Several roles rather than one title, since no single label covers the work.
    roles: ["software engineer", "freelancer", "lifelong learner"],
    email: "harshal.ladhe.1@gmail.com",
    // Hosted externally so the PDF stays out of the repo and can be refreshed without a redeploy.
    resume: "https://upw9bo4art0pzkyp.public.blob.vercel-storage.com/resume.pdf",
    url: "https://harshal-ladhe.vercel.app",
    social: {
      github: "https://github.com/shivam091",
      linkedin: "https://www.linkedin.com/in/shivam091",
      instagram: "http://instagram.com/taurusian_soul"
    }
  },

  // Fixed start of the copyright range so only the end year needs to move.
  foundedYear: 2026,

  verification: {
    // Proves ownership to Search Console via a meta tag, avoiding DNS records or uploaded files.
    google: [
      "hTBhtR_jnBb5Cua7vHU-6J3unFg6ADgRtGv1oaJeuVg"
    ]
  },

  // One combined request for every family; display=swap avoids invisible text while fonts load.
  font_url: "https://fonts.googleapis.com/css2?family=Alan+Sans:wght@300..900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&family=Source+Code+Pro:wght@200..900&display=swap",

  analytics: {
    // Measurement IDs are public by design, so committing it is safe.
    googleMeasurementId: "G-R5EZ91PMYX"
  },

  readTime: {
    // Below the typical prose pace because code-heavy content is read more slowly.
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

  // Site-wide switch so the decorative hit counter can be dropped without touching page layouts.
  hitCounter: true,

  // Home page sections. Each block can be toggled off, and empty sections hide
  // themselves regardless. Port of the Jekyll home generators' `_config.yml`.
  home: {
    // Posts flagged `pinned: true` in the registry, surfaced first.
    pinnedPosts: {
      enabled: true
    },
    // Posts flagged `featured: true` in the registry.
    featuredPosts: {
      enabled: true
    },
    // Tags ranked by recency-weighted frequency across recently-updated posts.
    trendingTags: {
      enabled: true,
      // Maximum number of tags to surface.
      limit: 10,
      // How many recently-updated posts feed the ranking window.
      maxPosts: 30,
      // Recency decay applied to each post's contribution: "exponential", "log", or "linear".
      decayStrategy: "exponential" as "exponential" | "log" | "linear",
      // Scale scores to 0–100 so the top tag always reads 100.
      normalization: true
    },
    // Categories ranked by total post count.
    popularCategories: {
      enabled: true,
      // Maximum number of categories to surface.
      limit: 5
    },
    // Posts ordered by last-modified date, newest first.
    recentlyUpdatedPosts: {
      enabled: true,
      // Maximum number of posts to surface.
      limit: 5
    }
  }
};

// Derived from the object so the type can never drift from the actual config.
export type SiteConfig = typeof siteConfig;
