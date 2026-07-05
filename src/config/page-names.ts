// Maps route path → human-readable title used by PageHeading and BreadcrumbsJsonLd.
// Paths not listed fall back to the last URL segment, de-hyphenated.
export const pageNames: Record<string, string> = {
  "/about": "About",
  "/code-of-conduct": "Code of Conduct",
  "/privacy-policy": "Privacy Policy",
  "/terms-of-use": "Terms of Use",
  "/contact": "Contact Harshal",
  "/how-did-i-build-my-blog": "How Did I Build My Blog",
  "/goodies": "Goodies",
  "/snippets": "Snippets",
  "/posts": "Posts",
  "/series": "Series",
};
