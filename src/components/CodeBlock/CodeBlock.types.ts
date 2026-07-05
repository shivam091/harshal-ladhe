// Carries server-highlighted HTML plus the raw source, since the copy button needs plain text, not markup.
export interface CodeBlockClientProps {
  code: string;
  html: string;
  // Normalised Shiki language, passed on so a copy can be attributed to it.
  language: string;
  showCopyButton?: boolean;
}

// Mirrors what an MDX code fence provides, so authored snippets map straight onto the component.
export interface CodeBlockProps {
  language: string;
  children: string;
  // Off for pseudo-code or output samples that aren't meant to be copied.
  showCopyButton?: boolean;
}
