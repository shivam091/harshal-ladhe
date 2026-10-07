"use client";

import { useState } from "react";
import type { ChangeEvent, DragEvent, JSX } from "react";
import { FolderOpenIcon } from "@/components/Icon";
import { SectionCard, PanelTitle } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";
import { DropZone, SourceTextarea, DropRow, DropHint, UploadFitting, HiddenFileInput, StatusText } from "@/components/LineDrawingAnimator/InputPanel/InputPanel.styles";
import type { InputPanelProps } from "@/components/LineDrawingAnimator/LineDrawingAnimator.types";

// Generous for line art, small enough that a mis-dropped photo-trace can't freeze the tab while every path is measured.
const MAX_FILE_BYTES = 1024 * 1024;

// Accepts by extension as well as MIME type, since some operating systems hand .svg files over with an empty type.
function isSvgFile(file: File): boolean {
  return file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
}

/*
  The ink well's intake: paste markup, drop a file onto the blotter, or pick one with the brass
  upload fitting (a real file input underneath, so it works by keyboard too). Reports both parse
  errors and anything the sanitiser had to strip.
*/
export default function InputPanel({ state, artwork, actions }: InputPanelProps): JSX.Element {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Shared by the drop handler and the file input, so both paths validate and report identically.
  async function readFile(file: File | undefined) {
    if (!file) return;
    if (!isSvgFile(file)) {
      setFileError(`${file.name} isn't an SVG file.`);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileError(`${file.name} is over 1 MB — too large to measure stroke by stroke.`);
      return;
    }
    setFileError(null);
    actions.loadFile(await file.text());
  }

  // Only file drops are intercepted — dropping plain text still falls through to the textarea's native behaviour.
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    setIsDragging(false);
    if (event.dataTransfer.files.length === 0) return;
    event.preventDefault();
    void readFile(event.dataTransfer.files[0]);
  }

  // preventDefault on dragover is what tells the browser this zone accepts a drop at all.
  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    setIsDragging(true);
  }

  // Clears the input afterwards so choosing the same file twice in a row still fires a change.
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    void readFile(event.target.files?.[0]);
    event.target.value = "";
  }

  const error = fileError ?? artwork.error;
  const status = error ?? (artwork.removed > 0 ? `Removed ${artwork.removed} unsafe item${artwork.removed === 1 ? "" : "s"} (scripts, on* handlers or javascript: links).` : `${artwork.strokes.length} stroke${artwork.strokes.length === 1 ? "" : "s"} found.`);

  return (
    <>
      <SectionCard aria-labelledby="ld-input-title">
        <PanelTitle id="ld-input-title">Ink well</PanelTitle>
        <DropZone data-dragging={isDragging ? "true" : undefined} onDragOver={handleDragOver} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
          <SourceTextarea
            id="ld-source"
            aria-label="SVG markup"
            spellCheck={false}
            aria-describedby="ld-source-hint ld-source-status"
            aria-invalid={error ? true : undefined}
            data-invalid={error ? "true" : undefined}
            value={state.source}
            onChange={(event) => actions.setSource(event.target.value)}
            onBlur={actions.commitEdit}
          />
          <DropRow>
            <DropHint id="ld-source-hint">Paste SVG markup, drop an .svg file here, or</DropHint>
            <UploadFitting>
              <HiddenFileInput type="file" accept=".svg,image/svg+xml" onChange={handleFileChange} />
              <FolderOpenIcon size={14} />
              Upload .svg
            </UploadFitting>
          </DropRow>
        </DropZone>
        <StatusText id="ld-source-status" role="status" aria-live="polite" data-tone={error ? "error" : undefined}>
          {status}
        </StatusText>
      </SectionCard>
    </>
  );
}

InputPanel.displayName = "InputPanel";
