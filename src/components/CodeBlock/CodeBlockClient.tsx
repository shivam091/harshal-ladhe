"use client";

import * as React from "react";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockClientProps } from "@/interfaces/code-block";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";

// Client shell: owns copy state and forwards each copy event as a shimmer trigger.
export default function CodeBlockClient({ code, html, showCopyButton = true }: CodeBlockClientProps) {
  const [copyTrigger, setCopyTrigger] = React.useState(0);

  // Bumps the trigger so Shimmer mounts a fresh, independent animation instance per copy.
  function handleCopy() {
    setCopyTrigger((prev) => prev + 1);
  }

  return (
    <>
      <CodeBlockWrapper>
        {showCopyButton && <CopyButton code={code} onCopy={handleCopy} />}
        {/*
          data-has-copy-button drives Pre's top-margin compensation — see CodeBlock.styles.ts.
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
