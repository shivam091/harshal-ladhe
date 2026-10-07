"use client";

import { useState } from "react";
import type { JSX } from "react";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { toCssKeyframesExport, toCssTransitionExport, toPathsExport, toReactSpringExport, toSmilExport } from "@/components/SvgPathMorph/SvgPathMorph.utils";
import { ParchmentCard, PanelTitle, PanelHint } from "@/components/SvgPathMorph/SvgPathMorph.styles";
import { TabRow, Tab } from "@/components/SvgPathMorph/ExportPanel/ExportPanel.styles";
import type { ExportPanelProps, MorphExportFormat, MorphExportFormatId } from "@/components/SvgPathMorph/SvgPathMorph.types";

// Each tab's label, Shiki language, builder and caveat — every builder reads the same matched strings, so the formats can never disagree.
const FORMATS: MorphExportFormat[] = [
  { id: "css-keyframes", label: "CSS @keyframes", language: "css", note: "CSS d: path() animates in Chromium and Firefox, not Safari.", build: toCssKeyframesExport },
  { id: "css-transition", label: "CSS transition", language: "css", note: "Hover or class-toggled; same browser support as @keyframes.", build: toCssTransitionExport },
  { id: "smil", label: "SMIL", language: "xml", note: "Works everywhere SVG does, Safari included.", build: toSmilExport },
  { id: "react", label: "React spring", language: "jsx", note: "A snippet for @react-spring/web — install it in your own project.", build: toReactSpringExport },
  { id: "paths", label: "Matched paths", language: "json", note: "The matched strings alone, for your own animation code.", build: (_state, result) => toPathsExport(result) }
];

// Tabbed, highlighted, copyable exports on a parchment scroll — the same CopyButton/Shimmer/CodeBlock trio every goodie's export uses.
export default function ExportPanel({ state, outcome }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<MorphExportFormatId>("css-keyframes");
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = outcome.ok ? format.build(state, outcome.result) : "// Fix the keyframe that won't parse to brew an export.";
  const html = useHighlightedCode(code, outcome.ok ? format.language : "plaintext");

  return (
    <>
      <ParchmentCard aria-labelledby="morph-export-title">
        <PanelTitle id="morph-export-title">Recipe</PanelTitle>
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
        <PanelHint>{format.note}</PanelHint>
        <CodeBlockWrapper>
          <CopyButton code={code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
          <Pre tabIndex={0} role="region" aria-label={`Generated ${format.label} code`} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
          <Shimmer trigger={copyTrigger} />
        </CodeBlockWrapper>
      </ParchmentCard>
    </>
  );
}

ExportPanel.displayName = "ExportPanel";
