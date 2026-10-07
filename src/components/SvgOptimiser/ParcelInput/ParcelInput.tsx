"use client";

import { useState } from "react";
import type { ChangeEvent, DragEvent, JSX } from "react";
import { FolderOpenIcon } from "@/components/Icon";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { MAX_FILE_BYTES, isSvgFile, optimisedFileName } from "@/components/SvgOptimiser/SvgOptimiser.utils";
import { SectionCard, PanelTitle } from "@/components/SvgOptimiser/SvgOptimiser.styles";
import { DropZone, DropHint, UploadButton, HiddenFileInput, FileTag, SourceTextarea, ErrorText } from "@/components/SvgOptimiser/ParcelInput/ParcelInput.styles";
import type { ParcelInputProps } from "@/components/SvgOptimiser/SvgOptimiser.types";

/*
  The intake form: the source textarea plus two equivalent ways to hand over a file — dropping it
  on the hatch, or the upload button (a real file input underneath, so it works by keyboard and
  with assistive tech, not only with a pointer).
*/
export default function ParcelInput({ state, result, actions }: ParcelInputProps): JSX.Element {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Shared by the drop handler and the file input, so both paths validate and report errors identically.
  async function readFile(file: File | undefined) {
    if (!file) return;
    if (!isSvgFile(file)) {
      setFileError(`${file.name} isn't an SVG file.`);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileError(`${file.name} is over 2 MB — too heavy for this counter.`);
      return;
    }
    setFileError(null);
    actions.loadFile(file.name, await file.text());
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

  const error = fileError ?? result.error;

  return (
    <>
      <SectionCard>
        <PanelTitle data-form="P-12">Parcel contents</PanelTitle>
        <FileTag>
          <strong>{state.fileName || "untitled.svg"}</strong> → {optimisedFileName(state.fileName)}
        </FileTag>

        <FieldWrapper>
          <FieldLabel htmlFor="svg-optimiser-source">SVG markup</FieldLabel>
          <DropZone data-dragging={isDragging ? "true" : undefined} onDragOver={handleDragOver} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
            <SourceTextarea
              id="svg-optimiser-source"
              spellCheck={false}
              aria-describedby="svg-optimiser-source-hint"
              aria-invalid={error ? true : undefined}
              data-invalid={error ? "true" : undefined}
              value={state.source}
              onChange={(event) => actions.setSource(event.target.value)}
              onBlur={actions.commitEdit}
            />
            <DropHint id="svg-optimiser-source-hint">Paste markup, drop an .svg file here, or</DropHint>
            <UploadButton>
              <HiddenFileInput type="file" accept=".svg,image/svg+xml" onChange={handleFileChange} />
              <FolderOpenIcon size={14} />
              Upload .svg
            </UploadButton>
          </DropZone>
          <ErrorText role="status" aria-live="polite">
            {error}
          </ErrorText>
        </FieldWrapper>
      </SectionCard>
    </>
  );
}

ParcelInput.displayName = "ParcelInput";
