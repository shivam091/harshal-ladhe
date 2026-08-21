// Props for the <SvgSnippet> MDX component — raw SVG markup passed as MDX children, mirrors CodeBlockProps.
export interface SvgSnippetProps {
  children: string;
  // Whether to render the copy-to-clipboard button on the code view. Defaults to true.
  showCopyButton?: boolean;
}
