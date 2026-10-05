"use client";

import { useState } from "react";
import type { JSX } from "react";
import { toCssCustomProperties, toJsHelper, toPlainList, toSassHelper, toTailwindSpacing } from "@/utils/unit-converter-export";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { TabRow, Tab } from "@/components/UnitConverter/ExportPanel/ExportPanel.styles";
import { SectionCard, PanelTitle, PanelHint } from "@/components/UnitConverter/UnitConverter.styles";
import type { ExportPanelProps } from "@/components/UnitConverter/UnitConverter.types";

// Each format's own language (for Shiki) and how it derives its source text — every one compiles from the batch scale and context via utils/unit-converter-export.ts.
const FORMATS = [
  { id: "css", label: "CSS", language: "css", build: toCssCustomProperties },
  { id: "tailwind", label: "Tailwind", language: "javascript", build: toTailwindSpacing },
  { id: "sass", label: "Sass", language: "scss", build: toSassHelper },
  { id: "js", label: "JS", language: "typescript", build: toJsHelper },
  { id: "list", label: "List", language: "plaintext", build: toPlainList }
] as const;

// The batch scale as ready-to-paste tokens, plus a helper function so future values can be converted in the stylesheet itself instead of coming back here.
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
        <PanelHint>Built from the batch scale, converted to {state.batchUnit} with the current context.</PanelHint>
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
