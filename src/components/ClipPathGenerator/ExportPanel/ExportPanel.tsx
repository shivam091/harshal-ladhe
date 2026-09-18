"use client";

import { useState } from "react";
import type { JSX } from "react";
import { toCssDeclaration, toReactStyleObject, toSvgClipPathMarkup, toTailwindClass } from "@/utils/clip-path-export";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { TabRow, Tab } from "@/components/ClipPathGenerator/ExportPanel/ExportPanel.styles";
import { SectionCard, PanelTitle } from "@/components/ClipPathGenerator/ClipPathGenerator.styles";
import type { ExportPanelProps } from "@/interfaces/clip-path";

// Each format's own language (for Shiki) and how it derives its source text from the current shape — the single source of truth every export format compiles from is compileClipPathValue, reached indirectly through these utils/clip-path-export.ts functions.
const FORMATS = [
  { id: "css", label: "CSS", language: "css", build: toCssDeclaration },
  { id: "tailwind", label: "Tailwind", language: "plaintext", build: toTailwindClass },
  { id: "react", label: "React", language: "javascript", build: toReactStyleObject },
  { id: "svg", label: "SVG", language: "xml", build: (shape: Parameters<typeof toSvgClipPathMarkup>[0]) => toSvgClipPathMarkup(shape) }
] as const;

/*
  Multi-format code export — most competing clip-path tools stop at raw CSS; this also formats the
  same shape as a Tailwind arbitrary-value class, a React inline style object, and standalone SVG
  <clipPath> markup (for clipping an <img> where CSS clip-path support/perf differs), each just a
  thin string formatter over the one shared compileClipPathValue.
*/
export default function ExportPanel({ state }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<(typeof FORMATS)[number]["id"]>("css");
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = format.build(state.shape);
  const html = useHighlightedCode(code, format.language);

  return (
    <>
      <SectionCard>
        <PanelTitle>Export</PanelTitle>
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
