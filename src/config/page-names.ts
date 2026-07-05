// Explicit titles for routes whose slug alone wouldn't read right as a heading or breadcrumb.
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
  "/tutorials": "Tutorials",
  "/posts": "Posts",
  "/series": "Series"
};
