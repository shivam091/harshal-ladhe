"use client";

import { useState } from "react";
import type { JSX } from "react";
import { toCssDeclaration, toReactStyleObject, toTailwindClass } from "@/utils/color-export";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { FormatRow, FormatTab } from "@/components/ColorPaletteGenerator/ExportPanel/ExportPanel.styles";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/ColorPaletteGenerator/ColorPaletteGenerator.styles";
import type { ExportPanelProps } from "@/interfaces/color-palette";

// Each format's own language (for Shiki) and how it derives its source text — every format compiles the currently active ramp (state.rampMode decides OKLCH vs RGB-mix), reached indirectly through utils/color-export.ts.
const FORMATS = [
  { id: "css", label: "CSS", language: "css", build: toCssDeclaration },
  { id: "tailwind", label: "Tailwind", language: "javascript", build: toTailwindClass },
  { id: "react", label: "React", language: "javascript", build: toReactStyleObject }
] as const;

// The ramp's own "print order" — once a palette is dialed in, this is where it gets set into a pasteable format, mirroring every other goodie's own ExportPanel structure (useHighlightedCode + CopyButton + Shimmer over a shared CodeBlock shell).
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
          <PanelTitle>Spec Sheet</PanelTitle>
          <FormatRow role="tablist" aria-label="Export format">
            {FORMATS.map((f) => (
              <FormatTab
                key={f.id}
                role="tab"
                type="button"
                aria-selected={f.id === activeFormat}
                data-selected={f.id === activeFormat ? "true" : undefined}
                onClick={() => setActiveFormat(f.id)}
              >
                {f.label}
              </FormatTab>
            ))}
          </FormatRow>
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
