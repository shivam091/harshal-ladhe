"use client";

import { useState } from "react";
import type { JSX } from "react";
import { toCss, toHtml, toReact } from "@/utils/popover-anchor-builder-export";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { TabRow, Tab } from "@/components/PopoverAnchorBuilder/ExportPanel/ExportPanel.styles";
import { SectionCard, PanelTitle } from "@/components/PopoverAnchorBuilder/PopoverAnchorBuilder.styles";
import type { ExportPanelProps } from "@/interfaces/popover-anchor-builder";

// Each format's own language (for Shiki) and how it derives its source text — CSS/HTML both compile through utils/popover-anchor-builder(-export).ts's single source of truth, so the export tabs and the live preview's injected stylesheet never drift apart.
const FORMATS = [
  { id: "css", label: "CSS", language: "css", build: toCss },
  { id: "html", label: "HTML", language: "html", build: toHtml },
  { id: "react", label: "React", language: "jsx", build: toReact }
] as const;

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
