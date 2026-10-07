"use client";

import { useState } from "react";
import type { ChangeEvent, DragEvent, JSX } from "react";
import { FolderOpenIcon, PlusIcon } from "@/components/Icon";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { starterIcons } from "@/data/icon-sprite-builder-presets";
import { splitSprite } from "@/components/IconSpriteBuilder/IconSpriteBuilder.utils";
import { AlbumLeaf, PanelTitle, PaperButton } from "@/components/IconSpriteBuilder/IconSpriteBuilder.styles";
import {
  DropZone,
  SourceTextarea,
  ButtonRow,
  UploadLabel,
  HiddenFileInput,
  DropHint,
  ErrorText,
  StarterGrid,
  StarterChip,
  StarterArt
} from "@/components/IconSpriteBuilder/AcquisitionsPanel/AcquisitionsPanel.styles";
import type { AcquisitionsPanelProps } from "@/components/IconSpriteBuilder/IconSpriteBuilder.types";

// Big enough for any real icon or small sprite, small enough that a mis-dropped photo can't freeze the tab while it's parsed.
const MAX_FILE_BYTES = 256 * 1024;

// Accepts by extension as well as MIME type, since some operating systems hand over .svg files with an empty or generic type.
function isSvgFile(file: File): boolean {
  return file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
}

// One source becomes one icon — or, if it's an existing sprite, one icon per symbol.
function toEntries(source: string, origin: string, id?: string): Array<{ origin: string; source: string; id?: string }> {
  const symbols = splitSprite(source);
  if (symbols) return symbols.map((symbol) => ({ origin: `${origin} · #${symbol.id}`, source: symbol.source, id: symbol.id }));
  return [{ origin, source, id }];
}

/*
  The acquisitions desk: paste markup and add it, drop or choose several .svg files at once, or pick
  loose stamps from the starter packet. Every route ends in one addIcons call, so a whole drop is a
  single undo step.
*/
export default function AcquisitionsPanel({ actions }: AcquisitionsPanelProps): JSX.Element {
  const [draft, setDraft] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Shared by the drop handler and the file input, so both paths validate and report problems identically.
  async function readFiles(files: File[]) {
    const problems: string[] = [];
    const entries: Array<{ origin: string; source: string; id?: string }> = [];
    for (const file of files) {
      if (!isSvgFile(file)) problems.push(`${file.name} isn't an SVG file.`);
      else if (file.size > MAX_FILE_BYTES) problems.push(`${file.name} is over 256 kB — far larger than any icon should be.`);
      else entries.push(...toEntries(await file.text(), file.name, file.name));
    }
    setFileError(problems.length > 0 ? problems.join(" ") : null);
    if (entries.length > 0) actions.addIcons(entries);
  }

  // Only file drops are intercepted — dropping plain text still falls through to the textarea's native behaviour.
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    setIsDragging(false);
    if (event.dataTransfer.files.length === 0) return;
    event.preventDefault();
    void readFiles(Array.from(event.dataTransfer.files));
  }

  // preventDefault on dragover is what tells the browser this zone accepts a drop at all.
  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    setIsDragging(true);
  }

  // Clears the input afterwards so choosing the same files twice in a row still fires a change.
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    void readFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  // The draft is cleared once mounted, ready for the next paste.
  function handleAdd() {
    if (draft.trim().length === 0) return;
    actions.addIcons(toEntries(draft, "Pasted"));
    setDraft("");
  }

  return (
    <>
      <AlbumLeaf>
        <PanelTitle data-plate="Pl. I">Acquisitions</PanelTitle>

        <FieldWrapper>
          <FieldLabel htmlFor="icon-sprite-paste">Paste SVG markup</FieldLabel>
          <DropZone data-dragging={isDragging ? "true" : undefined} onDragOver={handleDragOver} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
            <SourceTextarea
              id="icon-sprite-paste"
              spellCheck={false}
              placeholder={'<svg viewBox="0 0 24 24">…</svg>'}
              aria-describedby="icon-sprite-paste-hint"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <ButtonRow>
              <PaperButton type="button" onClick={handleAdd} disabled={draft.trim().length === 0}>
                <PlusIcon size={14} />
                Mount in album
              </PaperButton>
              <UploadLabel>
                <HiddenFileInput type="file" accept=".svg,image/svg+xml" multiple onChange={handleFileChange} aria-label="Choose .svg files" />
                <FolderOpenIcon size={14} />
                Choose files
              </UploadLabel>
            </ButtonRow>
            <DropHint id="icon-sprite-paste-hint">Or drop several .svg files here. An existing sprite is split back into its icons.</DropHint>
          </DropZone>
          <ErrorText role="status" aria-live="polite">
            {fileError}
          </ErrorText>
        </FieldWrapper>

        <FieldWrapper>
          <FieldLabel as="span" id="icon-sprite-starter-label">
            Starter packet
          </FieldLabel>
          <StarterGrid role="group" aria-labelledby="icon-sprite-starter-label">
            {starterIcons.map((starter) => (
              <StarterChip key={starter.slug} type="button" onClick={() => actions.addStarter(starter)} aria-label={`Add the ${starter.name} starter icon`}>
                {/* Trusted, hand-written markup from the starter data — never user input. */}
                <StarterArt aria-hidden="true" dangerouslySetInnerHTML={{ __html: starter.source }} />
                {starter.name}
              </StarterChip>
            ))}
          </StarterGrid>
        </FieldWrapper>
      </AlbumLeaf>
    </>
  );
}

AcquisitionsPanel.displayName = "AcquisitionsPanel";
