"use client";

import * as React from "react";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import type { CodeBlockClientProps } from "@/components/CodeBlock/CodeBlock.types";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";

// Keeps interactivity in a small client island so highlighting stays server-only.
export default function CodeBlockClient({ code, html, language, showCopyButton = true }: CodeBlockClientProps) {
  const [copyTrigger, setCopyTrigger] = React.useState(0);

  // A counter rather than a boolean so rapid repeat copies each get their own shimmer.
  function handleCopy() {
    setCopyTrigger((prev) => prev + 1);
  }

  return (
    <>
      <CodeBlockWrapper>
        {showCopyButton && <CopyButton code={code} language={language} onCopy={handleCopy} />}
        {/*
          Pre (not the inner Shiki <pre>) is the actual horizontally-scrollable element, so it
          needs its own tabindex/role for keyboard users to reach and scroll it.
        */}
        <Pre
          tabIndex={0}
          role="region"
          aria-label="Code sample"
          data-has-copy-button={showCopyButton}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <Shimmer trigger={copyTrigger} />
      </CodeBlockWrapper>
    </>
  );
}
