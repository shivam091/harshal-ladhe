"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { useOpenGraphImage } from "@/hooks/use-open-graph-image";
import { decodeShareableState } from "@/utils/open-graph-serialize";
import { buildPreviewData } from "@/utils/open-graph-text";
import * as edit from "@/helpers/open-graph-editor";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import MetadataForm from "@/components/OpenGraphPreview/MetadataForm/MetadataForm";
import HeadImport from "@/components/OpenGraphPreview/HeadImport/HeadImport";
import PreviewBoard from "@/components/OpenGraphPreview/PreviewBoard/PreviewBoard";
import AuditPanel from "@/components/OpenGraphPreview/AuditPanel/AuditPanel";
import ExportPanel from "@/components/OpenGraphPreview/ExportPanel/ExportPanel";
import PresetGallery from "@/components/OpenGraphPreview/PresetGallery/PresetGallery";
import ShareControls from "@/components/OpenGraphPreview/ShareControls/ShareControls";
import {
  SectionCard,
  PanelTitle,
  Corkboard,
  ToolbarRow,
  ToolbarButton,
  GeneratorGrid,
  SidePanel,
  MainColumn
} from "@/components/OpenGraphPreview/OpenGraphPreview.styles";
import type { LocalImage, OpenGraphActions, OpenGraphEditorState, OpenGraphShareableState } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Namespaced per goodie so this tool's autosave never collides with another goodie's in the same origin.
const STORAGE_KEY = "open-graph-preview:state";

// Long enough to coalesce a burst of typing into one write, short enough that closing the tab rarely loses anything.
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's own localStorage autosave, then the default preset — same priority order as every other goodie's own loadInitialState.
function loadInitialState(sharedState: string | null): OpenGraphEditorState {
  if (sharedState) {
    const decoded = decodeShareableState(sharedState);
    if (decoded) return edit.normaliseFields(decoded);
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return edit.normaliseFields(JSON.parse(raw) as OpenGraphShareableState);
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default preset rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

// Text fields keep the browser's own undo while focused — hijacking Ctrl+Z there would throw away the per-keystroke undo people expect inside a field.
function isTextEditingTarget(target: EventTarget): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable || target instanceof HTMLTextAreaElement) return true;
  return target instanceof HTMLInputElement && !["checkbox", "radio", "range", "color", "file", "button"].includes(target.type);
}

/*
  Root client component: owns the field set via useUndoStack, derives one OpenGraphActions object
  every subcomponent shares, and handles the two forms of persistence — a `?state=` permalink
  decoded once on mount, and a debounced localStorage autosave thereafter. The uploaded local image
  is deliberately plain useState beside the undo stack rather than inside it: its object URL is
  only valid in this tab, so it must never reach the permalink or autosave, and keeping it out of
  history means undo can't resurrect a URL that's already been revoked.
*/
export default function OpenGraphPreview(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<OpenGraphEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;
  const [localImage, setLocalImage] = useState<LocalImage | null>(null);

  const previewData = useMemo(() => buildPreviewData(state, localImage), [state, localImage]);
  const measurement = useOpenGraphImage(previewData.imageSrc);

  // Debounced so a fast run of keystrokes doesn't hit localStorage on every frame — only once typing settles.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edit.toShareableState(state)));
      } catch {
        // Storage unavailable/full — autosave is a convenience, not a guarantee.
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state]);

  // Revokes each object URL once it's replaced or the tool unmounts, so repeated uploads don't pin old files in memory.
  useEffect(() => {
    if (!localImage) return;
    return () => URL.revokeObjectURL(localImage.url);
  }, [localImage]);

  // A file becomes an object URL rather than a data URL — instant regardless of file size, and nothing to accidentally serialise.
  const handleLocalImageChange = useCallback((file: File | null) => {
    setLocalImage(file ? { url: URL.createObjectURL(file), name: file.name } : null);
  }, []);

  const actions: OpenGraphActions = useMemo(
    () => ({
      setField: (key, value) => undoStack.setPresent((s) => edit.setField(s, key, value)),
      commitField: (key, value) => undoStack.commit((s) => edit.setField(s, key, value)),
      commitDrag: () => undoStack.commit(),
      importFields: (fields) => undoStack.commit((s) => edit.importFields(s, fields)),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetPreview: () => undoStack.commit(() => edit.resetPreview())
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere inside the tool except while typing in a field, where the browser's native undo stays in charge.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    if (isTextEditingTarget(event.target)) return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <Corkboard onKeyDown={handleKeyDown}>
        <ToolbarRow>
          <Tooltip content="Undo">
            <ToolbarButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
              <UndoIcon size={16} />
            </ToolbarButton>
          </Tooltip>
          <Tooltip content="Redo">
            <ToolbarButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
              <RedoIcon size={16} />
            </ToolbarButton>
          </Tooltip>
          <Tooltip content="Reset">
            <ToolbarButton type="button" onClick={actions.resetPreview} aria-label="Reset">
              <RefreshIcon size={16} />
            </ToolbarButton>
          </Tooltip>
        </ToolbarRow>

        <GeneratorGrid>
          <SidePanel>
            <SectionCard>
              <PanelTitle>Metadata</PanelTitle>
              <MetadataForm state={state} actions={actions} localImage={localImage} onLocalImageChange={handleLocalImageChange} />
            </SectionCard>
            <HeadImport actions={actions} />
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SidePanel>

          <MainColumn>
            <PreviewBoard data={previewData} />
            <AuditPanel state={state} localImage={localImage} measurement={measurement} />
            <ExportPanel state={state} localImage={localImage} measurement={measurement} />
          </MainColumn>
        </GeneratorGrid>
      </Corkboard>
    </>
  );
}

OpenGraphPreview.displayName = "OpenGraphPreview";
