"use client";

import { useState } from "react";
import type { JSX } from "react";
import { jsonToTs } from "@/utils/json-to-ts";
import { tsToJson } from "@/utils/ts-to-json";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { SectionCard, PanelTitle } from "@/components/JsonToTsGenerator/JsonToTsGenerator.styles";
import type { ResultPanelProps } from "@/interfaces/json-to-ts";

// The read-only conversion result — unlike the other goodies' ExportPanel, there's only ever one output format here (the OTHER language, not a choice of CSS/Tailwind/React), so this skips the tab row entirely.
export default function ResultPanel({ state }: ResultPanelProps): JSX.Element {
  const [copyTrigger, setCopyTrigger] = useState(0);
  const isJsonToTs = state.direction === "json-to-ts";
  const result = isJsonToTs ? jsonToTs(state.jsonSource, state.rootName) : tsToJson(state.tsSource, state.rootName);
  const html = useHighlightedCode(result.code, isJsonToTs ? "typescript" : "json");

  return (
    <>
      <SectionCard>
        <PanelTitle>{isJsonToTs ? "Generated TypeScript" : "Generated JSON"}</PanelTitle>
        {result.error ? (
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-fg-muted)" }}>Fix the error on the left to see a result here.</p>
        ) : result.code.length === 0 ? (
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-fg-muted)" }}>Nothing to convert yet — paste something on the left.</p>
        ) : (
          <CodeBlockWrapper>
            <CopyButton code={result.code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
            <Pre tabIndex={0} role="region" aria-label="Conversion result" data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
            <Shimmer trigger={copyTrigger} />
          </CodeBlockWrapper>
        )}
      </SectionCard>
    </>
  );
}

ResultPanel.displayName = "ResultPanel";
