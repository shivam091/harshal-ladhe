"use client";

import { useState } from "react";
import type { JSX } from "react";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { ArrowDownIcon } from "@/components/Icon";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { SectionCard, PanelTitle, HintText, GoldPin } from "@/components/SvgToReactConverter/SvgToReactConverter.styles";
import { HeaderRow, ByteMeter } from "@/components/SvgToReactConverter/ExportPanel/ExportPanel.styles";
import type { ExportPanelProps } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// Bytes in a readable unit — icons are almost always under a few kilobytes, so one decimal place is plenty.
function formatBytes(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} kB`;
}

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
  The output "pins": highlighted component source with copy and download, plus a byte meter. The
  meter compares the raw paste with the finished component — the component often comes out
  larger (imports, props wiring), so the delta is shown as-is rather than framed as a saving.
*/
export default function ExportPanel({ state, result }: ExportPanelProps): JSX.Element {
  const [copyTrigger, setCopyTrigger] = useState(0);
  const extension = state.options.typescript ? "tsx" : "jsx";
  const html = useHighlightedCode(result.code, extension);
  const delta = result.bytesBefore > 0 ? Math.round(((result.bytesAfter - result.bytesBefore) / result.bytesBefore) * 100) : 0;

  return (
    <>
      <SectionCard>
        <HeaderRow>
          <PanelTitle data-designator="P1">React output</PanelTitle>
          {!result.error && (
            <ByteMeter>
              {formatBytes(result.bytesBefore)} SVG → {formatBytes(result.bytesAfter)} .{extension} ({delta > 0 ? "+" : ""}
              {delta}%)
            </ByteMeter>
          )}
          <GoldPin type="button" disabled={Boolean(result.error)} onClick={() => downloadFile(`${result.componentName}.${extension}`, result.code)}>
            <ArrowDownIcon size={14} />
            Download .{extension}
          </GoldPin>
        </HeaderRow>
        {result.error ? (
          <HintText>Fix the error in the SVG input to see a component here.</HintText>
        ) : (
          <CodeBlockWrapper>
            <CopyButton code={result.code} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
            <Pre tabIndex={0} role="region" aria-label={`Generated ${result.componentName}.${extension}`} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
            <Shimmer trigger={copyTrigger} />
          </CodeBlockWrapper>
        )}
      </SectionCard>
    </>
  );
}

ExportPanel.displayName = "ExportPanel";
