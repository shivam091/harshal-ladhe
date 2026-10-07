"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX, KeyboardEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useUndoStack } from "@/hooks/use-undo-stack";
import { UndoIcon, RedoIcon, RefreshIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import GlassPanel from "@/components/FillRuleVisualiser/GlassPanel/GlassPanel";
import RayReadout from "@/components/FillRuleVisualiser/RayReadout/RayReadout";
import PathControls from "@/components/FillRuleVisualiser/PathControls/PathControls";
import ViewControls from "@/components/FillRuleVisualiser/ViewControls/ViewControls";
import PresetGallery from "@/components/FillRuleVisualiser/PresetGallery/PresetGallery";
import ExportPanel from "@/components/FillRuleVisualiser/ExportPanel/ExportPanel";
import ShareControls from "@/components/FillRuleVisualiser/ShareControls/ShareControls";
import { buildGeometry, castRay, describeRay } from "@/components/FillRuleVisualiser/FillRuleVisualiser.utils";
import * as edit from "@/components/FillRuleVisualiser/FillRuleVisualiser.helpers";
import {
  GlassWorkshop,
  Transom,
  TransomTitle,
  ToolbarRow,
  JewelButton,
  WorkGrid,
  TableColumn,
  NotesColumn,
  PaneRow,
  TrayRow
} from "@/components/FillRuleVisualiser/FillRuleVisualiser.styles";
import type {
  FillRuleActions,
  FillRuleEditorState,
  FillRulePanelVariant,
  FillRulePoint,
  FillRuleProbe,
  FillRuleSelection,
  FillRuleShareableState,
  FillRuleTool,
  FillRuleViewSettings
} from "@/components/FillRuleVisualiser/FillRuleVisualiser.types";

// localStorage key for the autosave; namespaced so it never collides with another goodie's.
const STORAGE_KEY = "fill-rule-visualiser:state";

// Long enough to skip the intermediate frames of a drag, short enough that a refresh rarely loses anything.
const AUTOSAVE_DEBOUNCE_MS = 400;

// The pinned ray is announced only once it settles, so dragging the plumb bob doesn't make a screen reader chatter.
const ANNOUNCE_DEBOUNCE_MS = 600;

// Loads the strongest available starting state: a shared `?state=` link, then the autosave, then the pentagram.
function loadInitialState(sharedState: string | null): FillRuleShareableState {
  if (sharedState) {
    const decoded = edit.decodeShareableState(sharedState);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = edit.sanitiseShareableState(JSON.parse(raw));
        if (saved) return saved;
      }
    } catch {
      // Corrupt or unavailable localStorage (private browsing, quota) — fall through to the default window.
    }
  }
  return edit.createDefaultShareableState();
}

// Text fields keep their own native undo history; hijacking Ctrl+Z there would rewind a pasted path instead of one keystroke.
function isTextEditingTarget(target: EventTarget): boolean {
  if (target instanceof HTMLTextAreaElement) return true;
  return target instanceof HTMLInputElement && ["text", "search", "url", "email", "number"].includes(target.type);
}

/*
  Root client component. Geometry lives on the undo stack; the ray, the view and the hover preview
  live in plain state, because stepping back through history should rewind what was drawn, not
  where the plumb line was pointing. Everything derived (flattened polygons, winding map, chevrons,
  ray crossings) is computed once here and handed to every pane, so side-by-side panes always agree.
*/
export default function FillRuleVisualiser(): JSX.Element {
  const searchParams = useSearchParams();
  const [initial] = useState(() => loadInitialState(searchParams.get("state")));
  const undoStack = useUndoStack<FillRuleEditorState>(() => ({ subpaths: initial.subpaths }));
  const { state } = undoStack;
  const [probe, setProbe] = useState<FillRuleProbe>(initial.probe);
  const [view, setView] = useState<FillRuleViewSettings>(initial.view);
  const [hover, setHover] = useState<FillRulePoint | null>(null);
  const [tool, setTool] = useState<FillRuleTool>("draw");
  const [activeSubpathRaw, setActiveSubpath] = useState(0);
  const [selectionRaw, setSelection] = useState<FillRuleSelection | null>(null);
  const [announcement, setAnnouncement] = useState("");

  // Undo or a delete can leave the active subpath or selection pointing at something gone; clamp rather than sync in an effect.
  const activeSubpath = Math.min(activeSubpathRaw, Math.max(0, state.subpaths.length - 1));
  const selection = selectionRaw && state.subpaths[selectionRaw.subpath]?.nodes[selectionRaw.node] ? selectionRaw : null;

  const geometry = useMemo(() => buildGeometry(state.subpaths), [state.subpaths]);
  const activeProbe = useMemo<FillRuleProbe>(() => (hover ? { ...hover, angle: probe.angle } : probe), [hover, probe]);
  const ray = useMemo(() => castRay(geometry.flat, activeProbe), [geometry, activeProbe]);
  const pinnedSummary = useMemo(() => describeRay(probe, castRay(geometry.flat, probe)), [geometry, probe]);
  const shareable = useMemo(() => edit.toShareableState(state, probe, view), [state, probe, view]);

  // Debounced so a drag doesn't hit localStorage on every frame — only once the gesture settles.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shareable));
      } catch {
        // Storage unavailable or full — autosave is a convenience, not a guarantee.
      }
    }, AUTOSAVE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [shareable]);

  // Hands the live region a settled summary of the pinned ray.
  useEffect(() => {
    const timer = setTimeout(() => setAnnouncement(pinnedSummary), ANNOUNCE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [pinnedSummary]);

  const actions: FillRuleActions = useMemo(
    () => ({
      moveNode: (s, n, point) => undoStack.setPresent((current) => edit.moveNode(current, s, n, point)),
      moveControl: (s, n, which, point) => undoStack.setPresent((current) => edit.moveControl(current, s, n, which, point)),
      nudgeNode: (s, n, dx, dy) =>
        undoStack.commit((current) => {
          const node = current.subpaths[s]?.nodes[n];
          return node ? edit.moveNode(current, s, n, { x: node.x + dx, y: node.y + dy }) : current;
        }),
      commitDrag: () => undoStack.commit(),
      addNode: (point) => {
        const nodes = state.subpaths[activeSubpath]?.nodes ?? [];
        const after = selection && selection.subpath === activeSubpath ? selection.node : null;
        const subpathIndex = state.subpaths.length === 0 ? 0 : activeSubpath;
        undoStack.commit((current) => edit.insertNode(current, subpathIndex, after, point));
        setActiveSubpath(subpathIndex);
        setSelection({ subpath: subpathIndex, node: after === null ? nodes.length : after + 1 });
      },
      deleteNode: (s, n) => {
        undoStack.commit((current) => edit.deleteNode(current, s, n));
        setSelection(null);
      },
      toggleCurve: (s, n) => undoStack.commit((current) => edit.toggleCurve(current, s, n)),
      addSubpath: () => {
        undoStack.commit((current) => edit.addSubpath(current));
        setActiveSubpath(state.subpaths.length);
        setSelection(null);
        setTool("draw");
      },
      deleteSubpath: (s) => {
        undoStack.commit((current) => edit.deleteSubpath(current, s));
        setActiveSubpath(Math.max(0, s - 1));
        setSelection(null);
      },
      reverseSubpath: (s) => {
        undoStack.commit((current) => edit.reverseOne(current, s));
        setSelection(null);
      },
      setActiveSubpath: (s) => {
        setActiveSubpath(s);
        setSelection(null);
      },
      select: (next) => {
        setSelection(next);
        if (next) setActiveSubpath(next.subpath);
      },
      applyPathData: (subpaths) => {
        undoStack.commit(() => ({ subpaths }));
        setActiveSubpath(0);
        setSelection(null);
      },
      applyPreset: (preset) => {
        undoStack.commit(() => edit.stateFromPreset(preset));
        setProbe({ ...preset.probe });
        setHover(null);
        setActiveSubpath(0);
        setSelection(null);
      },
      setProbe,
      setHoverProbe: setHover,
      setTool: (next) => {
        setTool(next);
        setHover(null);
      },
      setView: (next) => setView((current) => ({ ...current, ...next })),
      undo: undoStack.undo,
      redo: undoStack.redo,
      canUndo: undoStack.canUndo,
      canRedo: undoStack.canRedo,
      reset: () => {
        const fresh = edit.createDefaultShareableState();
        undoStack.commit(() => ({ subpaths: fresh.subpaths }));
        setProbe(fresh.probe);
        setView(fresh.view);
        setHover(null);
        setActiveSubpath(0);
        setSelection(null);
      }
    }),
    [undoStack, state.subpaths, activeSubpath, selection]
  );

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z work anywhere in the tool except inside text fields, which keep native undo.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") return;
    if (isTextEditingTarget(event.target)) return;
    event.preventDefault();
    if (event.shiftKey) actions.redo();
    else actions.undo();
  }

  const variants: FillRulePanelVariant[] = view.mode === "side" ? ["nonzero", "evenodd"] : [view.mode];

  return (
    <>
      <GlassWorkshop onKeyDown={handleKeyDown}>
        <Transom>
          <TransomTitle aria-hidden="true">Glazier&apos;s Light Table</TransomTitle>
          <ToolbarRow>
            <Tooltip content="Undo">
              <JewelButton type="button" onClick={actions.undo} disabled={!actions.canUndo} aria-label="Undo">
                <UndoIcon size={16} />
              </JewelButton>
            </Tooltip>
            <Tooltip content="Redo">
              <JewelButton type="button" onClick={actions.redo} disabled={!actions.canRedo} aria-label="Redo">
                <RedoIcon size={16} />
              </JewelButton>
            </Tooltip>
            <Tooltip content="Reset to the pentagram">
              <JewelButton type="button" onClick={actions.reset} aria-label="Reset to the pentagram">
                <RefreshIcon size={16} />
              </JewelButton>
            </Tooltip>
          </ToolbarRow>
        </Transom>

        <WorkGrid>
          <TableColumn>
            <ViewControls view={view} probe={activeProbe} actions={actions} />
            <PaneRow data-count={variants.length}>
              {variants.map((variant, index) => (
                <GlassPanel
                  key={variant}
                  variant={variant}
                  primary={index === 0}
                  subpaths={state.subpaths}
                  geometry={geometry}
                  probe={activeProbe}
                  ray={ray}
                  view={view}
                  tool={tool}
                  activeSubpath={activeSubpath}
                  selection={selection}
                  actions={actions}
                />
              ))}
            </PaneRow>
          </TableColumn>

          <NotesColumn>
            <RayReadout probe={activeProbe} ray={ray} announcement={announcement} previewing={hover !== null} />
            <PathControls subpaths={state.subpaths} geometry={geometry} activeSubpath={activeSubpath} selection={selection} tool={tool} actions={actions} />
          </NotesColumn>
        </WorkGrid>

        <TrayRow>
          <PresetGallery actions={actions} />
          <NotesColumn>
            <ExportPanel d={geometry.d} />
            <ShareControls state={shareable} />
          </NotesColumn>
        </TrayRow>
      </GlassWorkshop>
    </>
  );
}

FillRuleVisualiser.displayName = "FillRuleVisualiser";
