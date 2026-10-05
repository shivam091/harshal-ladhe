"use client";

import { useState } from "react";
import type { JSX } from "react";
import { toCssExport, toReactExport, toTailwindExport } from "@/utils/keyframes-builder-export";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { TabRow, Tab } from "@/components/KeyframesBuilder/ExportPanel/ExportPanel.styles";
import { SectionCard, PanelTitle } from "@/components/KeyframesBuilder/KeyframesBuilder.styles";
import type { ExportPanelProps } from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// Each format's Shiki language and builder — all three compile from the same compileKeyframes/compileAnimationShorthand pair, so they can never disagree about what the animation is.
const FORMATS = [
  { id: "css", label: "CSS", language: "css", build: toCssExport },
  { id: "tailwind", label: "Tailwind", language: "css", build: toTailwindExport },
  { id: "react", label: "React", language: "jsx", build: toReactExport }
] as const;

// Tabbed, highlighted, copyable export of the current animation — the same CopyButton/Shimmer/CodeBlock trio every goodie's export uses.
export default function ExportPanel({ state }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<(typeof FORMATS)[number]["id"]>("css");
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = format.build(state);
  const html = useHighlightedCode(code, format.language);

  return (
    <>
      <SectionCard aria-labelledby="keyframes-export-title">
        <PanelTitle id="keyframes-export-title">Export</PanelTitle>
        <TabRow role="tablist" aria-label="Export format">
          {FORMATS.map((f) => (
            <Tab
              key={f.id}
              role="tab"
              type="button"
              aria-selected={f.id === activeFormat}
              data-selected={f.id === activeFormat ? "true" : undefined}
              onClick={() => setActiveFormat(f.id)}
            >
              {f.label}
            </Tab>
          ))}
        </TabRow>
        <CodeBlockWrapper>
          <CopyButton code={code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
          <Pre tabIndex={0} role="region" aria-label={`Generated ${format.label} code`} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
          <Shimmer trigger={copyTrigger} />
        </CodeBlockWrapper>
      </SectionCard>
    </>
  );
}

ExportPanel.displayName = "ExportPanel";
