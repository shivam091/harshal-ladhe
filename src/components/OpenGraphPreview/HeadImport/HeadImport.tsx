"use client";

import { useId, useState } from "react";
import type { JSX } from "react";
import { parseHeadHtml } from "@/utils/open-graph-parse";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { SectionCard, PanelTitle, HelpText } from "@/components/OpenGraphPreview/OpenGraphPreview.styles";
import { SourceTextarea, ImportButton, StatusText } from "@/components/OpenGraphPreview/HeadImport/HeadImport.styles";
import type { HeadImportProps } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// The paste box is local state, not part of the undo stack — it's scratch input, and only the fields it produces are worth undoing.
export default function HeadImport({ actions }: HeadImportProps): JSX.Element {
  const id = useId();
  const [source, setSource] = useState("");
  const [status, setStatus] = useState<{ tone: "ok" | "warn"; message: string } | null>(null);

  // Parses with the browser's own DOMParser — scripts in the paste never execute and nothing is fetched, which is the only safe way to read arbitrary pasted markup.
  function handleImport() {
    const result = parseHeadHtml(source, new DOMParser());
    if (result.matchedCount === 0) {
      setStatus({ tone: "warn", message: "No recognised meta tags found — nothing was changed." });
      return;
    }
    actions.importFields(result.fields);
    setStatus({ tone: "ok", message: `Imported ${result.matchedCount} ${result.matchedCount === 1 ? "tag" : "tags"}. Undo restores the previous fields.` });
  }

  return (
    <>
      <SectionCard>
        <PanelTitle>Paste &lt;head&gt;</PanelTitle>
        <HelpText>Paste a page&apos;s head (from View Source) to fill the form. It&apos;s parsed in your browser — nothing is fetched.</HelpText>
        <FieldWrapper>
          <FieldLabel htmlFor={`${id}-source`}>HTML</FieldLabel>
          <SourceTextarea
            id={`${id}-source`}
            spellCheck={false}
            placeholder={'<meta property="og:title" content="…" />'}
            value={source}
            onChange={(event) => setSource(event.target.value)}
          />
        </FieldWrapper>
        <ImportButton type="button" onClick={handleImport} disabled={source.trim().length === 0}>
          Import tags
        </ImportButton>
        {status && (
          <StatusText role="status" data-tone={status.tone === "warn" ? "warn" : undefined}>
            {status.message}
          </StatusText>
        )}
      </SectionCard>
    </>
  );
}

HeadImport.displayName = "HeadImport";
