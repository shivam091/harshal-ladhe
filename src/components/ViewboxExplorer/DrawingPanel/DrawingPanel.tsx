"use client";

import { useId, useState } from "react";
import type { JSX } from "react";
import { viewboxExplorerSamples } from "@/data/viewbox-explorer-presets";
import { parseDrawing } from "@/components/ViewboxExplorer/ViewboxExplorer.utils";
import { SectionCard, PanelTitle, PanelHint, ButtonRow, TimerButton } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";
import { SourceArea, SourceLabel, ErrorText } from "@/components/ViewboxExplorer/DrawingPanel/DrawingPanel.styles";
import type { DrawingPanelProps } from "@/components/ViewboxExplorer/ViewboxExplorer.types";

/*
  Choose which negative sits on the light box: one of the built-in samples, or any SVG pasted in.
  The paste box is a draft — it only replaces the negative when loaded, so half-pasted markup never
  blanks the print, and a file that won't parse explains why instead.
*/
export default function DrawingPanel({ state, drawing, actions }: DrawingPanelProps): JSX.Element {
  const [draft, setDraft] = useState(state.customSource ?? "");
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  // Parses up front so a bad paste reports its error here rather than loading an empty negative.
  function handleLoad() {
    const parsed = parseDrawing(draft);
    if (!parsed.tree) {
      setError(parsed.error ?? "That doesn't look like an SVG.");
      return;
    }
    setError(null);
    actions.loadCustomDrawing(draft, parsed.bounds);
  }

  return (
    <>
      <SectionCard>
        <PanelTitle>Negative</PanelTitle>
        <ButtonRow role="group" aria-label="Sample drawings">
          {viewboxExplorerSamples.map((sample) => (
            <TimerButton
              key={sample.slug}
              type="button"
              data-led=""
              aria-pressed={state.customSource === null && state.sampleSlug === sample.slug}
              onClick={() => actions.selectSample(sample.slug)}
            >
              {sample.name}
            </TimerButton>
          ))}
        </ButtonRow>

        <SourceLabel htmlFor={`${id}-source`}>Or paste your own SVG</SourceLabel>
        <SourceArea
          id={`${id}-source`}
          value={draft}
          spellCheck={false}
          placeholder={'<svg viewBox="0 0 100 100">…</svg>'}
          onChange={(event) => setDraft(event.target.value)}
        />
        <ButtonRow>
          <TimerButton type="button" data-led="" aria-pressed={state.customSource !== null} onClick={handleLoad} disabled={draft.trim().length === 0}>
            Load onto the light box
          </TimerButton>
        </ButtonRow>
        <div aria-live="polite">{error && <ErrorText>{error}</ErrorText>}</div>
        {state.customSource !== null && drawing.error && <ErrorText>{drawing.error}</ErrorText>}
        <PanelHint>
          Scripts, event handlers and <code>javascript:</code> links are stripped before anything renders. The easel starts on the file&apos;s own{" "}
          <code>viewBox</code> (or its width and height).
        </PanelHint>
      </SectionCard>
    </>
  );
}

DrawingPanel.displayName = "DrawingPanel";
