// html is Shiki-generated markup from the server; code is the raw string forwarded to the copy button.
export interface CodeBlockClientProps {
  code: string;
  html: string;
  // Whether to render the copy-to-clipboard button. Defaults to true.
  showCopyButton?: boolean;
}

// language is the raw code-fence tag (e.g. "ts"); children is the unprocessed code string.
export interface CodeBlockProps {
  language: string;
  children: string;
  // Set to false to omit the copy button (e.g. non-copyable pseudo-code or output samples). Defaults to true.
  showCopyButton?: boolean;
}
