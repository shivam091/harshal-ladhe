// Subset of MDX frontmatter used by PostSignOff — carries the optional signoff text.
export interface PostMetadata {
  // Optional signoff text sourced from frontmatter (e.g. `signoff: "Catch you on the flip side! ✌️"`).
  // Set to `false` to suppress the closing text entirely — falls back to a bare PageSignOff.
  signoff?: string | false;
  [key: string]: any; // Allows other frontmatter fields without throwing type errors
}

// Props for PostSignOff — an explicit message overrides metadata.signoff, which overrides the built-in default.
export interface PostSignOffProps {
  // Direct one-off override. Takes highest priority over metadata and the default.
  message?: string;
  // Frontmatter/MDX metadata object. `metadata.signoff` is used when no `message` prop is provided.
  metadata?: PostMetadata;
}
