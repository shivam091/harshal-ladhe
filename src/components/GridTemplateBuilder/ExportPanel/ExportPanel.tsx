"use client";

import { useState } from "react";
import type { JSX } from "react";
import { toCssDeclaration, toReactStyleObject, toTailwindClass } from "@/utils/grid-template-builder-export";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { TabRow, Tab } from "@/components/GridTemplateBuilder/ExportPanel/ExportPanel.styles";
import { SectionCard, PanelTitle } from "@/components/GridTemplateBuilder/GridTemplateBuilder.styles";
import type { ExportPanelProps } from "@/interfaces/grid-template-builder";

// Each format's own language (for Shiki) and how it derives its source text — CSS/React compile via utils/grid-template-builder.ts's compileContainerDeclarations/compileContainerStyle; Tailwind's is markup (an HTML snippet with real utility classes, one per named area), not a single declaration, so it highlights as "html" rather than "plaintext" like a single-property goodie's Tailwind tab — same reasoning LayoutPlayground's own multi-element Tailwind tab already applies.
const FORMATS = [
  { id: "css", label: "CSS", language: "css", build: toCssDeclaration },
  { id: "tailwind", label: "Tailwind", language: "html", build: toTailwindClass },
  { id: "react", label: "React", language: "javascript", build: toReactStyleObject }
] as const;

// Tabbed CSS/Tailwind/React code output — highlighted, copyable, always compiled fresh from `state` rather than cached, so switching tabs or editing the grid never shows stale code.
export default function ExportPanel({ state }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<(typeof FORMATS)[number]["id"]>("css");
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = format.build(state);
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
