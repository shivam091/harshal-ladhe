"use client";

import { useState } from "react";
import type { JSX } from "react";
import { toJava, toJavaScript, toPython } from "@/utils/regex-export";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { TabRow, Tab } from "@/components/RegexTester/ExportPanel/ExportPanel.styles";
import { SectionCard, PanelTitle } from "@/components/RegexTester/RegexTester.styles";
import type { ExportPanelProps } from "@/interfaces/regex-tester";

// Each target language's own way of embedding this pattern, reached through utils/regex-export.ts — a best-effort flag translation (Python/Java have no equivalent to JS's 'g'/'y'), not a certified cross-dialect regex converter.
const FORMATS = [
  { id: "javascript", label: "JavaScript", language: "javascript", build: toJavaScript },
  { id: "python", label: "Python", language: "python", build: toPython },
  { id: "java", label: "Java", language: "java", build: toJava }
] as const;

export default function ExportPanel({ state }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<(typeof FORMATS)[number]["id"]>("javascript");
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = format.build(state);
  const html = useHighlightedCode(code, format.language);

  return (
    <>
      <SectionCard>
        <PanelTitle>Export</PanelTitle>
        <TabRow role="tablist" aria-label="Export language">
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
