"use client";

import { useEffect, useMemo } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import * as edit from "@/components/IconSpriteBuilder/IconSpriteBuilder.helpers";
import { buildSprite } from "@/components/IconSpriteBuilder/IconSpriteBuilder.utils";
import AcquisitionsPanel from "@/components/IconSpriteBuilder/AcquisitionsPanel/AcquisitionsPanel";
import OptionsPanel from "@/components/IconSpriteBuilder/OptionsPanel/OptionsPanel";
import PresetGallery from "@/components/IconSpriteBuilder/PresetGallery/PresetGallery";
import ShareControls from "@/components/IconSpriteBuilder/ShareControls/ShareControls";
import AlbumPage from "@/components/IconSpriteBuilder/AlbumPage/AlbumPage";
import FirstDayCover from "@/components/IconSpriteBuilder/FirstDayCover/FirstDayCover";
import {
  StampAlbum,
  SpineLabel,
  GiltTitle,
  ToolbarRow,
  GiltButton,
  AlbumSpread,
  SideColumn,
  MainColumn
} from "@/components/IconSpriteBuilder/IconSpriteBuilder.styles";
import type { IconSpriteActions, IconSpriteEditorState, IconSpriteShareableState } from "@/components/IconSpriteBuilder/IconSpriteBuilder.types";

// Namespaced per goodie so this album's autosave never collides with another tool's.
const STORAGE_KEY = "icon-sprite-builder:state";

// Long enough to let a burst of typing settle before writing, short enough that a closed tab rarely loses anything.
const AUTOSAVE_DEBOUNCE_MS = 400;

// Loads the strongest available starting state: a shared `?state=` link first, then the last session's autosave, then the default set — the same priority order as every other goodie.
function loadInitialState(sharedState: string | null): IconSpriteEditorState {
  if (sharedState) {
    const decoded = edit.decodeShareableState(sharedState);
    if (decoded) return edit.hydrateState(decoded);
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return edit.hydrateState(JSON.parse(raw) as IconSpriteShareableState);
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default set rather than crash the page.
    }
  }
  return edit.createDefaultEditorState();
}

// Text fields keep their own native undo history; hijacking Ctrl+Z there would rewind a whole album step when someone meant to undo one character.
function isTextEditingTarget(target: EventTarget): boolean {
  if (target instanceof HTMLTextAreaElement) return true;
  return target instanceof HTMLInputElement && ["text", "search", "url"].includes(target.type);
}

/*
  Root client component: owns the album via useUndoStack, builds the sprite once per state change
  (every panel reads that one memoised result rather than re-parsing each icon), and handles both
  forms of persistence — a `?state=` permalink decoded once on mount and a debounced localStorage
  autosave thereafter.
*/
export default function IconSpriteBuilder(): JSX.Element {
  const searchParams = useSearchParams();
  const undoStack = useUndoStack<IconSpriteEditorState>(() => loadInitialState(searchParams.get("state")));
  const { state } = undoStack;
  const result = useMemo(() => buildSprite(state.icons, state.options.currentColor, { idPrefix: "" }), [state.icons, state.options.currentColor]);

  // Debounced so a run of keystrokes in an id field doesn't hit localStorage on every one — only once typing settles.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edit.toShareableState(state)));
      } catch {
        // Storage unavailable or full (a very large album) — autosave is a convenience, not a guarantee.
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [state]);

  const actions: IconSpriteActions = useMemo(
    () => ({
      addIcons: (entries) => undoStack.commit((s) => edit.addIcons(s, entries)),
      addStarter: (starter) => undoStack.commit((s) => edit.addStarter(s, starter)),
      setIconId: (key, id) => undoStack.setPresent((s) => edit.setIconId(s, key, id)),
      commitIconId: (key) => undoStack.commit((s) => edit.normaliseIconId(s, key)),
      moveIcon: (key, delta) => undoStack.commit((s) => edit.moveIcon(s, key, delta)),
      removeIcon: (key) => undoStack.commit((s) => edit.removeIcon(s, key)),
      setCurrentColor: (value) => undoStack.commit((s) => edit.setOption(s, "currentColor", value)),
      setSpritePath: (path) => undoStack.setPresent((s) => edit.setOption(s, "spritePath", path)),
      commitEdit: () => undoStack.commit(),
      applyPreset: (preset) => undoStack.commit((s) => edit.applyPreset(s, preset)),
      clearAlbum: () => undoStack.commit((s) => edit.clearAlbum(s)),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      resetBuilder: () => undoStack.commit(() => edit.resetBuilder())
    }),
    [undoStack]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere in the album except inside text fields, which keep the browser's finer-grained native undo.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    if (isTextEditingTarget(event.target)) return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  return (
    <>
      <StampAlbum onKeyDown={handleKeyDown}>
        <SpineLabel>
          <GiltTitle aria-hidden="true">Sprite Album</GiltTitle>
          <ToolbarRow>
            <Tooltip content="Undo">
              <GiltButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </GiltButton>
            </Tooltip>
            <Tooltip content="Redo">
              <GiltButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </GiltButton>
            </Tooltip>
            <Tooltip content="Reset to the default set">
              <GiltButton type="button" onClick={actions.resetBuilder} aria-label="Reset to the default set">
                <RefreshIcon size={16} />
              </GiltButton>
            </Tooltip>
          </ToolbarRow>
        </SpineLabel>

        <AlbumSpread>
          <SideColumn>
            <AcquisitionsPanel actions={actions} />
            <OptionsPanel state={state} actions={actions} />
            <PresetGallery actions={actions} />
            <ShareControls state={state} />
          </SideColumn>

          <MainColumn>
            <AlbumPage state={state} result={result} actions={actions} />
            <FirstDayCover state={state} result={result} />
          </MainColumn>
        </AlbumSpread>
      </StampAlbum>
    </>
  );
}

IconSpriteBuilder.displayName = "IconSpriteBuilder";
