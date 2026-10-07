"use client";

import { useState } from "react";
import type { JSX } from "react";
import { shapeToMarkup } from "@/components/ShapeToPathConverter/ShapeToPathConverter.utils";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { TabRow, Tab } from "@/components/ShapeToPathConverter/ExportPanel/ExportPanel.styles";
import { SectionCard, PanelTitle } from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";
import type { ExportPanelProps, Shape } from "@/components/ShapeToPathConverter/ShapeToPathConverter.types";

/*
  Each format's language (for Shiki) and how it builds its text. The bare `d` is the headline,
  ready to drop into an existing `<path>`; the before-and-after pairs the original element with
  its replacement so the swap can be checked by eye.
*/
const FORMATS = [
  { id: "d", label: "Path data", language: "plaintext", build: (_shape: Shape, d: string) => d },
  { id: "path", label: "<path> element", language: "xml", build: (_shape: Shape, d: string) => `<path d="${d}" />` },
  { id: "both", label: "Before and after", language: "xml", build: (shape: Shape, d: string) => `<!-- Before -->\n${shapeToMarkup(shape)}\n\n<!-- After -->\n<path d="${d}" />` }
] as const;

// Tabbed copy panel, the same shape as every other goodie's export, over the one shared conversion.
export default function ExportPanel({ shape, d }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<(typeof FORMATS)[number]["id"]>("d");
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = d ? format.build(shape, d) : "<!-- This shape draws nothing, so there is no path to export. -->";
  const html = useHighlightedCode(code, format.language);

  return (
    <>
      <SectionCard>
        <PanelTitle>Answer</PanelTitle>
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
      </SectionCard>
    </>
  );
}

ExportPanel.displayName = "ExportPanel";
