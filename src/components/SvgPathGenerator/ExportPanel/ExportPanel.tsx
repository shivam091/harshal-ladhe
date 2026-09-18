"use client";

import { useState } from "react";
import type { JSX } from "react";
import { toPathData, toReactJsx, toSvgMarkup } from "@/utils/svg-path-export";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { TabRow, Tab } from "@/components/SvgPathGenerator/ExportPanel/ExportPanel.styles";
import { SectionCard, PanelTitle } from "@/components/SvgPathGenerator/SvgPathGenerator.styles";
import type { ExportPanelProps } from "@/interfaces/svg-path";

// Each format's own language (for Shiki) and how it derives its source text from the current state — "Path data" is the tool's headline output (the bare `d` value, ready to paste into an existing `<path d="...">`), with the full markup and React formats as ready-to-drop alternatives.
const FORMATS = [
  { id: "path", label: "Path Data", language: "plaintext", build: toPathData },
  { id: "svg", label: "SVG", language: "xml", build: toSvgMarkup },
  { id: "react", label: "React", language: "javascript", build: toReactJsx }
] as const;

/*
  Multi-format code export, mirroring ClipPathGenerator's own ExportPanel: a tab per format, each a
  thin string formatter over the one shared compilePathData.
*/
export default function ExportPanel({ state }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<(typeof FORMATS)[number]["id"]>("path");
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
