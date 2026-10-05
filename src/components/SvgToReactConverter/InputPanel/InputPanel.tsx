"use client";

import { useState } from "react";
import type { ChangeEvent, DragEvent, JSX } from "react";
import { FolderOpenIcon } from "@/components/Icon";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { SectionCard, PanelTitle } from "@/components/SvgToReactConverter/SvgToReactConverter.styles";
import {
  DropZone,
  DropHint,
  UploadPin,
  HiddenFileInput,
  NameInput,
  SourceTextarea,
  ErrorText
} from "@/components/SvgToReactConverter/InputPanel/InputPanel.styles";
import type { InputPanelProps } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// Big enough for any real icon or logo, small enough that a mis-dropped photo can't freeze the tab while it's parsed and highlighted.
const MAX_FILE_BYTES = 1024 * 1024;

// Accepts by extension as well as MIME type, since some operating systems hand over .svg files with an empty or generic type.
function isSvgFile(file: File): boolean {
  return file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
}

/*
  The input "connector": component name, the source textarea, and two equivalent ways to load a
  file — drag-and-drop onto the zone, or the upload button (a real file input underneath, so it
  works by keyboard and with assistive tech, not only with a pointer).
*/
export default function InputPanel({ state, result, actions }: InputPanelProps): JSX.Element {
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
      setFileError(`${file.name} is over 1 MB — that's larger than any icon should be.`);
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
        <PanelTitle data-designator="J1">SVG input</PanelTitle>

        <FieldWrapper>
          <FieldLabel htmlFor="svg-to-react-name">Component name</FieldLabel>
          <NameInput
            id="svg-to-react-name"
            type="text"
            spellCheck={false}
            autoComplete="off"
            placeholder={result.componentName}
            value={state.componentName}
            onChange={(event) => actions.setComponentName(event.target.value)}
            onBlur={actions.commitDrag}
          />
        </FieldWrapper>

        <FieldWrapper>
          <FieldLabel htmlFor="svg-to-react-source">SVG markup</FieldLabel>
          <DropZone
            data-dragging={isDragging ? "true" : undefined}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <SourceTextarea
              id="svg-to-react-source"
              spellCheck={false}
              aria-describedby="svg-to-react-source-hint"
              aria-invalid={error ? true : undefined}
              data-invalid={error ? "true" : undefined}
              value={state.source}
              onChange={(event) => actions.setSource(event.target.value)}
              onBlur={actions.commitDrag}
            />
            <DropHint id="svg-to-react-source-hint">Paste markup, drop an .svg file here, or</DropHint>
            <UploadPin>
              <HiddenFileInput type="file" accept=".svg,image/svg+xml" onChange={handleFileChange} />
              <FolderOpenIcon size={14} />
              Upload .svg
            </UploadPin>
          </DropZone>
          <ErrorText role="status" aria-live="polite">
            {error}
          </ErrorText>
        </FieldWrapper>
      </SectionCard>
    </>
  );
}

InputPanel.displayName = "InputPanel";
