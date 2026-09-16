"use client";

import { useState } from "react";
import type { JSX } from "react";
import { toCssDeclaration, toReactStyleObject, toTailwindClass } from "@/utils/filter-export";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { StopRing, Stop } from "@/components/FilterGenerator/ExportPanel/ExportPanel.styles";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/FilterGenerator/FilterGenerator.styles";
import type { ExportPanelProps } from "@/interfaces/filter";

// Each format's own language (for Shiki) and how it derives its source text from the current state — the single source of truth every export format compiles from is compileFilterValue, reached indirectly through these utils/filter-export.ts functions.
const FORMATS = [
  { id: "css", label: "CSS", language: "css", build: toCssDeclaration },
  { id: "tailwind", label: "Tailwind", language: "plaintext", build: toTailwindClass },
  { id: "react", label: "React", language: "javascript", build: toReactStyleObject }
] as const;

// Aperture-stop tabs over the filter's own code-export snippet, one per output format — mirrors every other goodie's own ExportPanel structure (useHighlightedCode + CopyButton + Shimmer over a shared CodeBlock shell).
export default function ExportPanel({ state }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<(typeof FORMATS)[number]["id"]>("css");
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = format.build(state);
  const html = useHighlightedCode(code, format.language);

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Export</PanelTitle>
          <StopRing role="tablist" aria-label="Export format">
            {FORMATS.map((f) => (
              <Stop
                key={f.id}
                role="tab"
                type="button"
                aria-selected={f.id === activeFormat}
                data-selected={f.id === activeFormat ? "true" : undefined}
                onClick={() => setActiveFormat(f.id)}
              >
                {f.label}
              </Stop>
            ))}
          </StopRing>
        </PanelHeader>
        <PanelBody>
          <CodeBlockWrapper>
            <CopyButton code={code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
            <Pre tabIndex={0} role="region" aria-label={`Generated ${format.label} code`} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
            <Shimmer trigger={copyTrigger} />
          </CodeBlockWrapper>
        </PanelBody>
      </Panel>
    </>
  );
}

ExportPanel.displayName = "ExportPanel";
