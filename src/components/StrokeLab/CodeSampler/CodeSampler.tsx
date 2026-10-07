"use client";

import { useState } from "react";
import type { JSX } from "react";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { TabStrip, SampleTab } from "@/components/StrokeLab/CodeSampler/CodeSampler.styles";
import type { CodeSamplerProps } from "@/components/StrokeLab/StrokeLab.types";

/*
  Tabbed, highlighted, copyable code — the same useHighlightedCode + CopyButton + Shimmer over the
  shared CodeBlock shell that every goodie's ExportPanel uses, factored out once here because the
  lab has two exports (the stroke snippet and the draw-on animation) that need identical chrome.
*/
export default function CodeSampler({ label, samples }: CodeSamplerProps): JSX.Element {
  const [activeId, setActiveId] = useState(samples[0]?.id ?? "");
  const [copyTrigger, setCopyTrigger] = useState(0);
  const sample = samples.find((s) => s.id === activeId) ?? samples[0];
  const html = useHighlightedCode(sample.code, sample.language);

  return (
    <>
      <TabStrip role="tablist" aria-label={label}>
        {samples.map((s) => (
          <SampleTab key={s.id} role="tab" type="button" aria-selected={s.id === sample.id} onClick={() => setActiveId(s.id)}>
            {s.label}
          </SampleTab>
        ))}
      </TabStrip>
      <CodeBlockWrapper>
        <CopyButton code={sample.code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
        <Pre tabIndex={0} role="region" aria-label={`Generated ${sample.label} code`} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
        <Shimmer trigger={copyTrigger} />
      </CodeBlockWrapper>
    </>
  );
}

CodeSampler.displayName = "CodeSampler";
