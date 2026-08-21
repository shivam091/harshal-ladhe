import type { JSX } from "react";
import type { SvgSnippetProps } from "@/components/SvgSnippet/SvgSnippet.types";
import CodeBlock from "@/components/CodeBlock";
import { SvgSnippetWrapper, SvgPreview } from "@/components/SvgSnippet/SvgSnippet.styles";

// Pairs SVG source with its live render so readers see exactly what the markup draws.
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
