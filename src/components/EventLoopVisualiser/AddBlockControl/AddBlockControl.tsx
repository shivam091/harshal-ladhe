"use client";

import { useState } from "react";
import type { JSX } from "react";
import { PlusIcon } from "@/components/Icon";
import { BLOCK_KIND_LABELS, MAX_BLOCK_DEPTH } from "@/helpers/event-loop-editor";
import { AddRow, KindSelect, AddButton } from "@/components/EventLoopVisualiser/AddBlockControl/AddBlockControl.styles";
import type { AddBlockControlProps, EventLoopBlockKind } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// Menu order follows BLOCK_KIND_LABELS, which lists the primitives roughly in the order the async post introduces them.
const KIND_OPTIONS = Object.entries(BLOCK_KIND_LABELS) as [EventLoopBlockKind, string][];

// Pick-then-add rather than one button per kind — seven buttons at every nesting level would bury the program itself.
export default function AddBlockControl({ target, depth, actions }: AddBlockControlProps): JSX.Element | null {
  const [kind, setKind] = useState<EventLoopBlockKind>("log");
  if (depth > MAX_BLOCK_DEPTH) return null;
  const where = target.parentId === null ? "the script" : "this callback";

  return (
    <>
      <AddRow>
        <KindSelect value={kind} onChange={(event) => setKind(event.target.value as EventLoopBlockKind)} aria-label={`Block type to add to ${where}`}>
          {KIND_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </KindSelect>
        <AddButton type="button" onClick={() => actions.addBlock(target, kind)} aria-label={`Add ${BLOCK_KIND_LABELS[kind]} to ${where}`}>
          <PlusIcon size={12} aria-hidden="true" />
          Add
        </AddButton>
      </AddRow>
    </>
  );
}

AddBlockControl.displayName = "AddBlockControl";
