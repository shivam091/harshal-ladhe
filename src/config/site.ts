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

  analytics: {
    // Measurement IDs are public by design, so committing it is safe.
    googleMeasurementId: "G-R5EZ91PMYX"
  },

  // Site-wide switch so the decorative hit counter can be dropped without touching page layouts.
  hitCounter: true
};

// Derived from the object so the type can never drift from the actual config.
export type SiteConfig = typeof siteConfig;
