"use client";

import { useState } from "react";
import type { JSX } from "react";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import type { CodeSlipProps } from "@/components/IconSpriteBuilder/IconSpriteBuilder.types";

// The site's own highlighted code block with copy and shimmer — one per snippet, so each icon's <use> can be copied on its own.
export default function CodeSlip({ code, language, label }: CodeSlipProps): JSX.Element {
  const [copyTrigger, setCopyTrigger] = useState(0);
  const html = useHighlightedCode(code, language);

  return (
    <>
      <CodeBlockWrapper>
        <CopyButton code={code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
        <Pre tabIndex={0} role="region" aria-label={label} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
        <Shimmer trigger={copyTrigger} />
      </CodeBlockWrapper>
    </>
  );
}

CodeSlip.displayName = "CodeSlip";
