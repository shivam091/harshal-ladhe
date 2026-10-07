"use client";

import { useMemo, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { ArrowDownIcon } from "@/components/Icon";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { buildCssExport, buildReactExport, buildSvgExport, buildWaapiExport } from "@/components/LineDrawingAnimator/LineDrawingAnimator.utils";
import { SectionCard, PanelTitle, PanelHint, BrassButton } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";
import { HeaderRow, TabRow, Tab, CodeFrame } from "@/components/LineDrawingAnimator/ExportPanel/ExportPanel.styles";
import type { ExportFormat, ExportPanelProps } from "@/components/LineDrawingAnimator/LineDrawingAnimator.types";

// Each format's label, Shiki language, download name and builder — all four read the same timeline, so they can never disagree about the drawing.
const FORMATS = [
  { id: "svg", label: "Animated SVG", language: "html", fileName: "line-drawing.svg", build: buildSvgExport },
  { id: "css", label: "CSS only", language: "css", fileName: "line-drawing.css", build: buildCssExport },
  { id: "react", label: "React", language: "tsx", fileName: "LineDrawing.tsx", build: buildReactExport },
  { id: "waapi", label: "Web Animations", language: "javascript", fileName: "line-drawing.js", build: buildWaapiExport }
] as const satisfies ReadonlyArray<{ id: ExportFormat; label: string; language: string; fileName: string; build: unknown }>;

// What each format is for, shown under the tabs.
const FORMAT_HINTS: Record<ExportFormat, string> = {
  svg: "A self-contained SVG with its own <style>: drop it into a page or open it directly.",
  css: "Only the stylesheet, keyed by classes. The comment at the top lists which element gets which class.",
  react: "A component with the stylesheet embedded, emitted by the SVG → React converter.",
  waapi: "Plain JavaScript using element.animate(). It finds strokes in your original SVG by document order, so no extra attributes are needed."
};

// Hands the code over as a real file via a temporary object URL, revoked straight after so repeated downloads don't leak blobs.
function downloadFile(fileName: string, contents: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: "text/plain;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

/*
  The letter file of exports: four index tabs, highlighted code with the shared copy button and
  shimmer, and a download fitting. Tabs follow the ARIA tabs pattern, including ←/→ between them.
*/
export default function ExportPanel({ input }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>("svg");
  const [copyTrigger, setCopyTrigger] = useState(0);
  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = useMemo(() => format.build(input), [format, input]);
  const html = useHighlightedCode(code, format.language);

  // Arrow keys move between tabs, as the ARIA tabs pattern expects.
  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, position: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = FORMATS[(position + (event.key === "ArrowRight" ? 1 : FORMATS.length - 1)) % FORMATS.length];
    setActiveFormat(next.id);
    document.getElementById(`ld-tab-${next.id}`)?.focus();
  }

  return (
    <>
      <SectionCard aria-labelledby="ld-export-title">
        <PanelTitle id="ld-export-title">Letter file</PanelTitle>
        <HeaderRow>
          <TabRow role="tablist" aria-label="Export format">
            {FORMATS.map((f, position) => (
              <Tab
                key={f.id}
                id={`ld-tab-${f.id}`}
                role="tab"
                type="button"
                aria-selected={f.id === activeFormat}
                aria-controls="ld-export-code"
                tabIndex={f.id === activeFormat ? 0 : -1}
                onClick={() => setActiveFormat(f.id)}
                onKeyDown={(event) => handleTabKeyDown(event, position)}
              >
                {f.label}
              </Tab>
            ))}
          </TabRow>
          <BrassButton type="button" disabled={code.length === 0} onClick={() => downloadFile(format.fileName, code)}>
            <ArrowDownIcon size={14} />
            {format.fileName}
          </BrassButton>
        </HeaderRow>
        <PanelHint>{FORMAT_HINTS[format.id]}</PanelHint>
        {code.length === 0 ? (
          <PanelHint>Fix the SVG in the ink well to see an export here.</PanelHint>
        ) : (
          <CodeFrame id="ld-export-code" role="tabpanel" aria-labelledby={`ld-tab-${format.id}`}>
            <CodeBlockWrapper>
              <CopyButton code={code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
              <Pre tabIndex={0} role="region" aria-label={`Generated ${format.label} code`} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
              <Shimmer trigger={copyTrigger} />
            </CodeBlockWrapper>
          </CodeFrame>
        )}
      </SectionCard>
    </>
  );
}

ExportPanel.displayName = "ExportPanel";
