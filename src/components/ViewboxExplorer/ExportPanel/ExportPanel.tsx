"use client";

import { useState } from "react";
import type { JSX } from "react";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { buildMatrixSnippet, buildReactSnippet, buildSvgSnippet } from "@/components/ViewboxExplorer/ViewboxExplorer.utils";
import { SectionCard, PanelTitle, PanelHint } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";
import { TabRow, Tab } from "@/components/ViewboxExplorer/ExportPanel/ExportPanel.styles";
import type { ExportFormatId, ExportPanelProps } from "@/components/ViewboxExplorer/ViewboxExplorer.types";

// Each format's Shiki language and a one-line note on when to reach for it.
const FORMATS: ReadonlyArray<{ id: ExportFormatId; label: string; language: string; note: string }> = [
  { id: "svg", label: "SVG", language: "xml", note: "Paste your drawing's contents where the comment is." },
  { id: "react", label: "React", language: "tsx", note: "Props spread last, so a className or a new size still overrides." },
  { id: "matrix", label: "Matrix", language: "xml", note: "The same print with no viewBox at all — just the scale and translate the browser would compute." }
];

/*
  Export as plain markup, a React component, or the equivalent hand-written matrix — the last one
  is the proof that viewBox plus preserveAspectRatio is only ever a scale and a translate.
*/
export default function ExportPanel({ state, transform }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<ExportFormatId>("svg");
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = format.id === "svg" ? buildSvgSnippet(state) : format.id === "react" ? buildReactSnippet(state) : buildMatrixSnippet(state, transform);
  const html = useHighlightedCode(code, format.language);

  return (
    <>
      <SectionCard>
        <PanelTitle>Export</PanelTitle>
        <TabRow role="tablist" aria-label="Export format">
          {FORMATS.map((f) => (
            <Tab key={f.id} role="tab" type="button" aria-selected={f.id === activeFormat} onClick={() => setActiveFormat(f.id)}>
              {f.label}
            </Tab>
          ))}
        </TabRow>
        <CodeBlockWrapper>
          <CopyButton code={code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
          <Pre tabIndex={0} role="region" aria-label={`Generated ${format.label} code`} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
          <Shimmer trigger={copyTrigger} />
        </CodeBlockWrapper>
        <PanelHint>{format.note}</PanelHint>
      </SectionCard>
    </>
  );
}

ExportPanel.displayName = "ExportPanel";
