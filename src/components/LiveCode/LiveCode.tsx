"use client";

import { useState } from "react";
import type { JSX } from "react";
import type { LiveCodeProps } from "@/components/LiveCode/LiveCode.types";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";

/*
  A copyable, highlighted code block for interactive demos whose source is computed from state — CodeBlock
  highlights once on the server, so it can't follow a reader's control changes.
*/
export default function LiveCode({ code, language, label }: LiveCodeProps): JSX.Element {
  const [copyTrigger, setCopyTrigger] = useState(0);
  const trimmedCode = code.trim();
  const html = useHighlightedCode(trimmedCode, language);

  return (
    <>
      <CodeBlockWrapper>
        <CopyButton code={trimmedCode} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
        <Pre tabIndex={0} role="region" aria-label={label} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
        <Shimmer trigger={copyTrigger} />
      </CodeBlockWrapper>
    </>
  );
}

LiveCode.displayName = "LiveCode";
