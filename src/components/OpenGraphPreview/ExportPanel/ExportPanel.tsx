"use client";

import { useState } from "react";
import type { JSX } from "react";
import { toHtmlMetaTags, toNextMetadata, toReactHead } from "@/utils/open-graph-export";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import TabList from "@/components/OpenGraphPreview/TabList/TabList";
import { SectionCard, PanelTitle, HelpText } from "@/components/OpenGraphPreview/OpenGraphPreview.styles";
import type { ExportPanelProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Each format's own language (for Shiki) and builder — all three render from the same tag list in utils/open-graph-export.ts, so they can never disagree.
const FORMATS = [
  { id: "html", label: "HTML", language: "html", build: toHtmlMetaTags },
  { id: "next", label: "Next.js metadata", language: "typescript", build: toNextMetadata },
  { id: "react", label: "React <Head>", language: "tsx", build: toReactHead }
] as const;

// The tab row's entries, derived from FORMATS so the two lists can't drift apart.
const TABS = FORMATS.map(({ id, label }) => ({ id, label }));

// Mirrors the other goodies' ExportPanel, with a note when the previewed image is a local file — that one can't be exported, only the URL field can.
export default function ExportPanel({ state, localImage, measurement }: ExportPanelProps): JSX.Element {
  const [activeFormat, setActiveFormat] = useState<(typeof FORMATS)[number]["id"]>("html");
  const [copyTrigger, setCopyTrigger] = useState(0);

  const format = FORMATS.find((f) => f.id === activeFormat) ?? FORMATS[0];
  const code = format.build(state, measurement, localImage);
  const html = useHighlightedCode(code, format.language);

  return (
    <>
      <SectionCard>
        <PanelTitle>Export</PanelTitle>
        {localImage && (
          <HelpText>
            The uploaded image is only previewed here — host it, paste its absolute URL into Image URL, and the export will pick it up.
          </HelpText>
        )}
        <TabList label="Export format" idPrefix="open-graph-export" tabs={TABS} selected={activeFormat} onSelect={setActiveFormat} />
        <div id={`open-graph-export-panel-${activeFormat}`} role="tabpanel" aria-labelledby={`open-graph-export-tab-${activeFormat}`}>
          <CodeBlockWrapper>
            <CopyButton code={code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
            <Pre tabIndex={0} role="region" aria-label={`Generated ${format.label} code`} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
            <Shimmer trigger={copyTrigger} />
          </CodeBlockWrapper>
        </div>
      </SectionCard>
    </>
  );
}

ExportPanel.displayName = "ExportPanel";
