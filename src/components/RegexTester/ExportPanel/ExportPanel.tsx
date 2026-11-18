"use client";

import { useState } from "react";
import type { JSX } from "react";
import { toJava, toJavaScript, toPython, toRuby } from "@/components/RegexTester/RegexTester.utils";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { Segmented, Segment } from "@/components/RegexTester/ExportPanel/ExportPanel.styles";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/RegexTester/RegexTester.styles";
import type { ExportPanelProps } from "@/components/RegexTester/RegexTester.types";

// Each target language's own way of embedding this pattern, reached through utils/regex-export.ts — a best-effort flag translation (Ruby/Python/Java have no equivalent to JS's 'g'/'y'), not a certified cross-dialect regex converter.
const FORMATS = [
  { id: "javascript", label: "JavaScript", language: "javascript", build: toJavaScript },
  { id: "ruby", label: "Ruby", language: "ruby", build: toRuby },
  { id: "python", label: "Python", language: "python", build: toPython },
  { id: "java", label: "Java", language: "java", build: toJava }
] as const;

// Segmented tabs over the pattern's own code-export snippet, one per target language — mirrors CronBuilder's own ExportPanel structure (useHighlightedCode + CopyButton + Shimmer over a shared CodeBlock shell).
export default function ExportPanel({ state }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<(typeof FORMATS)[number]["id"]>("javascript");
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = format.build(state);
  const html = useHighlightedCode(code, format.language);

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Export</PanelTitle>
          <Segmented role="tablist" aria-label="Export language">
            {FORMATS.map((f) => (
              <Segment
                key={f.id}
                role="tab"
                type="button"
                aria-selected={f.id === activeFormat}
                data-selected={f.id === activeFormat ? "true" : undefined}
                onClick={() => setActiveFormat(f.id)}
              >
                {f.label}
              </Segment>
            ))}
          </Segmented>
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
