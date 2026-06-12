// Loosely typed so a post's full frontmatter can be passed straight through.
export interface PageMetadata {
  // `false` lets a post opt out of the closing note even when its layout asks for one.
  signoff?: string | false;
  [key: string]: any; // Allows other frontmatter fields without throwing type errors
}

// Text sources run from most to least specific so a page can override its post and a post the site default.
export interface PageSignOffProps {
  // Opt-in, since most pages close with just the divider.
  showText?: boolean;
  // For one-off pages that have no frontmatter to set a signoff in.
  message?: string;
  // Lets a post set its signoff in frontmatter instead of in layout code.
  metadata?: PageMetadata;
}
