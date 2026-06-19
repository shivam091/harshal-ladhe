// Explicit titles for routes whose slug alone wouldn't read right as a heading or breadcrumb.
// Paths not listed fall back to the last URL segment, de-hyphenated.
export const pageNames: Record<string, string> = {
  "/about": "About",
  "/how-did-i-build-my-blog": "How Did I Build My Blog"
};
