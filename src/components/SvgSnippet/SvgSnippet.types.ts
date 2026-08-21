// Markup arrives as MDX children, mirroring CodeBlockProps, so authors write it like any code fence.
export interface SvgSnippetProps {
  children: string;
  // Whether to render the copy-to-clipboard button on the code view. Defaults to true.
  showCopyButton?: boolean;
}
