"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { JSX } from "react";
import { convertMarkup } from "@/components/ShapeToPathConverter/ShapeToPathConverter.utils";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { SectionCard, PanelTitle, PanelHint } from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";
import {
  PasteGrid,
  PasteColumn,
  PasteCaption,
  PasteInput,
  ResultList,
  ResultItem,
  ResultMark,
  ResultNote,
  ResultButton
} from "@/components/ShapeToPathConverter/PasteConverter/PasteConverter.styles";
import type { PasteConverterProps } from "@/components/ShapeToPathConverter/ShapeToPathConverter.types";

// Kept apart from the editor's own autosave key, so the pasted markup survives a reload without riding along in permalinks.
const PASTE_STORAGE_KEY = "shape-to-path:paste";

// Same settle time as the editor's autosave, so typing doesn't write to storage on every keystroke.
const PASTE_DEBOUNCE_MS = 400;

// A starter document using every supported shape, with presentation attributes that should survive the swap.
const SAMPLE_MARKUP = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="35" height="25" rx="6" fill="#6366f1" />
  <circle cx="72" cy="22" r="12" fill="none" stroke="#be123c" stroke-width="2" />
  <ellipse cx="27" cy="62" rx="17" ry="10" fill="#ec4899" fill-opacity="0.3" />
  <line x1="55" y1="50" x2="90" y2="50" stroke="#4338ca" stroke-width="2" />
  <polyline points="55,90 65,65 75,90 85,65" fill="none" stroke="#10b981" stroke-width="3" />
  <polygon points="10,95 25,78 40,95" fill="#f59e0b" />
</svg>`;

// Restores the last pasted markup, falling back to the sample when there is none or storage is unavailable.
function loadInitialMarkup(): string {
  if (typeof window === "undefined") return SAMPLE_MARKUP;
  try {
    return window.localStorage.getItem(PASTE_STORAGE_KEY) ?? SAMPLE_MARKUP;
  } catch {
    return SAMPLE_MARKUP;
  }
}

/*
  Whole-document conversion: paste any SVG and every basic shape in it is rewritten as a `<path>`
  in place, keeping fills, strokes, classes and transforms. Each tag is marked off with a tick or
  a cross, and any converted one can be loaded onto the canvas to see its working.
*/
export default function PasteConverter({ mode, precision, actions }: PasteConverterProps): JSX.Element {
  const inputId = useId();
  const [markup, setMarkup] = useState(loadInitialMarkup);
  const [copyTrigger, setCopyTrigger] = useState(0);
  const { output, results } = useMemo(() => convertMarkup(markup, mode, precision), [markup, mode, precision]);
  const html = useHighlightedCode(output, "xml");

  // Debounced so a burst of typing writes to storage once it settles.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(PASTE_STORAGE_KEY, markup);
      } catch {
        // Storage unavailable/full — the paste box is a convenience, not a guarantee.
      }
    }, PASTE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [markup]);

  return (
    <>
      <SectionCard>
        <PanelTitle>Homework: convert a whole SVG</PanelTitle>
        <PanelHint>
          Paste SVG markup and every <code>&lt;rect&gt;</code>, <code>&lt;circle&gt;</code>, <code>&lt;ellipse&gt;</code>, <code>&lt;line&gt;</code>,{" "}
          <code>&lt;polyline&gt;</code> and <code>&lt;polygon&gt;</code> becomes a <code>&lt;path&gt;</code>, using the command style and precision chosen above.
          Everything else, including presentation attributes, is left as you wrote it.
        </PanelHint>
        <PasteGrid>
          <PasteColumn>
            <PasteCaption htmlFor={inputId}>Your SVG</PasteCaption>
            <PasteInput id={inputId} spellCheck={false} value={markup} onChange={(event) => setMarkup(event.target.value)} />
          </PasteColumn>
          <PasteColumn>
            <PasteCaption as="span">Converted</PasteCaption>
            <CodeBlockWrapper>
              <CopyButton code={output} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
              <Pre tabIndex={0} role="region" aria-label="Converted SVG markup" data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
              <Shimmer trigger={copyTrigger} />
            </CodeBlockWrapper>
          </PasteColumn>
        </PasteGrid>

        {results.length === 0 ? (
          <PanelHint>No basic shapes found yet. Paths, groups and text pass straight through untouched.</PanelHint>
        ) : (
          <ResultList aria-label="Shapes found">
            {results.map((result, index) => (
              <ResultItem key={index}>
                <ResultMark aria-hidden="true">{result.d ? "✓" : "✗"}</ResultMark>
                <code>{`<${result.kind}>`}</code>
                <span>{result.d ? "converted" : "left as it is"}</span>
                {result.shape && result.d && (
                  <ResultButton type="button" onClick={() => result.shape && actions.loadShape(result.shape)}>
                    Show the working
                  </ResultButton>
                )}
                {result.warning && <ResultNote>{result.warning}</ResultNote>}
              </ResultItem>
            ))}
          </ResultList>
        )}
      </SectionCard>
    </>
  );
}

PasteConverter.displayName = "PasteConverter";
