import type { JSX } from "react";
import type { SvgSnippetProps } from "@/interfaces/svg-snippet";
import CodeBlock from "@/components/CodeBlock";
import { SvgSnippetWrapper, SvgPreview } from "@/components/SvgSnippet/SvgSnippet.styles";

// Server component: shows raw SVG markup as a highlighted, copyable code block, then renders that same markup live underneath.
export default function SvgSnippet({ children, showCopyButton = true }: SvgSnippetProps): JSX.Element {
  const code = children.trim(); // MDX always appends a trailing newline inside the fence

  return (
    <SvgSnippetWrapper>
      <CodeBlock language="html" showCopyButton={showCopyButton}>
        {code}
      </CodeBlock>
      {/* code is authored directly in this repo's own MDX, not user input — same trust boundary CodeBlockClient's Shiki HTML already crosses. */}
      <SvgPreview dangerouslySetInnerHTML={{ __html: code }} />
    </SvgSnippetWrapper>
  );
}

SvgSnippet.displayName = "SvgSnippet";
