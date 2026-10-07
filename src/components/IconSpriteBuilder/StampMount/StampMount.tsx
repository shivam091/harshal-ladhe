"use client";

import { useRef } from "react";
import type { JSX } from "react";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@/components/Icon";
import {
  MountSlot,
  ClearMount,
  PerforatedStamp,
  Vignette,
  Denomination,
  DamageText,
  CatalogueNumber,
  IdInput,
  Provenance,
  NoteList,
  MountControls,
  TweezerButton
} from "@/components/IconSpriteBuilder/StampMount/StampMount.styles";
import type { StampMountProps } from "@/components/IconSpriteBuilder/IconSpriteBuilder.types";

// The stamp's on-screen height follows the icon's own proportions, so a wide logo isn't squashed into a square.
function previewHeight(viewBox: string, size: number): number {
  const [, , width, height] = viewBox.split(" ").map(Number);
  return width > 0 && height > 0 ? Math.round((size * height) / width) : size;
}

/*
  One perforated stamp: the icon drawn through a real <use>, its viewBox as the denomination, a
  handwritten catalogue number, the editable id, and the notes on what the pipeline changed. The
  earlier/later buttons are the keyboard (and pointer) way to reorder, so no drag is ever required.
*/
export default function StampMount({ icon, processed, index, count, previewPrefix, size, tint, actions, onMove, onRemove }: StampMountProps): JSX.Element {
  // Skips the blur-time commit when the id wasn't touched, so tabbing through the album doesn't fill the undo stack with no-op steps.
  const dirty = useRef(false);
  const inputId = `icon-sprite-id-${icon.key}`;
  const label = processed.id;

  return (
    <>
      <MountSlot>
        <ClearMount>
          <PerforatedStamp data-damaged={processed.error ? "true" : undefined}>
            <Vignette style={{ color: tint }}>
              {processed.error ? (
                <DamageText>{processed.error}</DamageText>
              ) : (
                <svg width={size} height={previewHeight(processed.viewBox, size)} role="img" aria-label={`${label} icon`}>
                  <use href={`#${previewPrefix}${processed.id}`} />
                </svg>
              )}
            </Vignette>
            <Denomination aria-hidden="true">{processed.error ? "DAMAGED" : processed.viewBox}</Denomination>
          </PerforatedStamp>
        </ClearMount>

        <CatalogueNumber aria-hidden="true">
          No. {index + 1} · #{label}
        </CatalogueNumber>
        <IdInput
          id={inputId}
          aria-label={`Symbol id for stamp ${index + 1}`}
          type="text"
          spellCheck={false}
          autoComplete="off"
          value={icon.id}
          placeholder={label}
          onChange={(event) => {
            dirty.current = true;
            actions.setIconId(icon.key, event.target.value);
          }}
          onBlur={() => {
            if (!dirty.current) return;
            dirty.current = false;
            actions.commitIconId(icon.key);
          }}
        />
        {icon.id !== label && <Provenance>Will be saved as #{label}</Provenance>}
        <Provenance>{icon.origin}</Provenance>

        {processed.notes.length > 0 && (
          <NoteList aria-label={`Notes on ${label}`}>
            {processed.notes.map((note) => (
              <li key={note.message} data-tone={note.tone}>
                {note.message}
              </li>
            ))}
          </NoteList>
        )}

        <MountControls>
          <TweezerButton type="button" data-move={`${icon.key}-earlier`} disabled={index === 0} onClick={() => onMove(icon, -1)} aria-label={`Move ${label} earlier`}>
            <ChevronLeftIcon size={14} />
          </TweezerButton>
          <TweezerButton type="button" data-move={`${icon.key}-later`} disabled={index === count - 1} onClick={() => onMove(icon, 1)} aria-label={`Move ${label} later`}>
            <ChevronRightIcon size={14} />
          </TweezerButton>
          <TweezerButton type="button" data-variant="remove" onClick={() => onRemove(icon)} aria-label={`Remove ${label}`}>
            <TrashIcon size={14} />
          </TweezerButton>
        </MountControls>
      </MountSlot>
    </>
  );
}

StampMount.displayName = "StampMount";
