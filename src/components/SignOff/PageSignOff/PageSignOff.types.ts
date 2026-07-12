// Subset of MDX frontmatter used by PageSignOff — carries the optional signoff text.
export interface PageMetadata {
  // Optional signoff text sourced from frontmatter (e.g. `signoff: "Catch you on the flip side! ✌️"`).
  // Set to `false` to suppress the closing text entirely — falls back to a bare divider.
  signoff?: string | false;
  [key: string]: any; // Allows other frontmatter fields without throwing type errors
}

// Props for PageSignOff — showText opts into the closing paragraph; an explicit message
// overrides metadata.signoff, which overrides the built-in default.
export interface PageSignOffProps {
  // Renders the closing text paragraph above the divider. Defaults to false (bare divider only).
  showText?: boolean;
  // Direct one-off override. Takes highest priority over metadata and the default.
  message?: string;
  // Frontmatter/MDX metadata object. `metadata.signoff` is used when no `message` prop is provided.
  metadata?: PageMetadata;
}
