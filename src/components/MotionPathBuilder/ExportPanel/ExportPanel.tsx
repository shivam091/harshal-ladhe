"use client";

import { useState } from "react";
import type { JSX } from "react";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { buildCssExport, buildReactExport, buildSmilExport } from "@/components/MotionPathBuilder/MotionPathBuilder.utils";
import { SectionCard, PanelTitle, CheckRow } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";
import { ExportHeader, TabRow, Tab, CoordinateNotes, CoordinateNote } from "@/components/MotionPathBuilder/ExportPanel/ExportPanel.styles";
import type { ExportPanelProps, MotionPathExportFormat } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

// Each format's tab label and Shiki language — CSS is the headline, since that's what the preview actually runs.
const FORMATS: { id: MotionPathExportFormat; label: string; language: string }[] = [
  { id: "css", label: "CSS", language: "css" },
  { id: "smil", label: "SVG SMIL", language: "xml" },
  { id: "react", label: "React", language: "javascript" }
];

/*
  Three ways to take the run away: CSS offset-path, an SVG with animateMotion, or a React
  component. Above the code sit the two coordinate notes, because the same numbers mean different
  things in each — and that difference is the usual reason a pasted motion path lands in the wrong place.
*/
export default function ExportPanel({ state }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<MotionPathExportFormat>("css");
  const [inlinePath, setInlinePath] = useState(false);
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = activeFormat === "css" ? buildCssExport(state) : activeFormat === "smil" ? buildSmilExport(state, inlinePath) : buildReactExport(state);
  const html = useHighlightedCode(code, format.language);

  return (
    <>
      <SectionCard>
        <PanelTitle>Timetable export</PanelTitle>

        <CoordinateNotes>
          <CoordinateNote>
            <strong>CSS offset-path</strong> reads <code>path()</code> numbers as CSS pixels from the top-left of the element&apos;s containing
            block. They never scale: draw at 480 × 300 and the parent must be 480 × 300, with the element pinned to its top-left.
          </CoordinateNote>
          <CoordinateNote>
            <strong>SVG SMIL</strong> reads the same numbers in the SVG&apos;s user space — the <code>viewBox</code> — so the track and the
            moving element scale together when the <code>&lt;svg&gt;</code> is resized.
          </CoordinateNote>
        </CoordinateNotes>

        <ExportHeader>
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
          {activeFormat === "smil" && (
            <CheckRow>
              <input type="checkbox" checked={inlinePath} onChange={(event) => setInlinePath(event.target.checked)} />
              Inline <code>path</code> instead of <code>&lt;mpath&gt;</code>
            </CheckRow>
          )}
        </ExportHeader>

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
