"use client";

import { useId, useState } from "react";
import type { JSX } from "react";
import { PlusIcon, SwapIcon, TrashIcon } from "@/components/Icon";
import { CANVAS_SIZE, fitToCanvas, parsePathData } from "@/components/FillRuleVisualiser/FillRuleVisualiser.utils";
import { SectionCard, PanelTitle, PanelHint, ButtonRow, JewelButton } from "@/components/FillRuleVisualiser/FillRuleVisualiser.styles";
import {
  SubpathList,
  SubpathRow,
  SubpathName,
  Quarry,
  SubpathMeta,
  PathTextarea,
  FieldLabel,
  FieldMessage
} from "@/components/FillRuleVisualiser/PathControls/PathControls.styles";
import type { FillRulePoint, PathControlsProps } from "@/components/FillRuleVisualiser/FillRuleVisualiser.types";

// Below this much signed area a subpath's loops cancel out (a figure-eight), so "clockwise" would mislead.
const MIXED_AREA = 1;

// Names a subpath's overall drawing direction from its signed area — the thing reversing it flips.
function describeOrientation(area: number): string {
  if (Math.abs(area) < MIXED_AREA) return "mixed directions";
  return area > 0 ? "clockwise ↻ (+1)" : "anticlockwise ↺ (−1)";
}

/*
  The glazier's cutting list: what a click on the table does, the subpaths with their direction and
  a reverse button each, keyboard-friendly point tools, and a d-string field for pasting a path in.
  Reverse sits on every row because flipping an inner subpath is the clearest way to watch a
  nonzero hole open and close.
*/
export default function PathControls({ subpaths, geometry, activeSubpath, selection, tool, actions }: PathControlsProps): JSX.Element {
  const fieldId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const selectedNode = selection ? subpaths[selection.subpath]?.nodes[selection.node] : undefined;

  // The keyboard route to drawing: a new point halfway along the selected edge, or just past the active subpath's last point.
  function handleAddPoint() {
    const nodes = subpaths[activeSubpath]?.nodes ?? [];
    let point: FillRulePoint = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };
    if (selection && selection.subpath === activeSubpath && nodes[selection.node]) {
      const current = nodes[selection.node];
      const next = nodes[(selection.node + 1) % nodes.length];
      point = { x: (current.x + next.x) / 2 + (nodes.length === 1 ? 30 : 0), y: (current.y + next.y) / 2 };
    } else if (nodes.length > 0) {
      const last = nodes[nodes.length - 1];
      point = { x: last.x + 30, y: last.y + 30 };
    }
    actions.addNode(point);
  }

  // Parses the draft, scales it onto the table if needed, and commits it as one undo step.
  function handleApply() {
    if (draft === null) return;
    const parsed = parsePathData(draft);
    if (!parsed.ok) {
      setMessage({ text: parsed.error, error: true });
      return;
    }
    const fitted = fitToCanvas(parsed.subpaths);
    actions.applyPathData(fitted.subpaths);
    setDraft(null);
    setMessage(fitted.fitted ? { text: "Scaled and centred to fit the light table.", error: false } : null);
  }

  return (
    <>
      <SectionCard aria-labelledby={`${fieldId}-title`}>
        <PanelTitle id={`${fieldId}-title`}>Cutting list</PanelTitle>

        <ButtonRow role="group" aria-label="What a click on the light table does">
          <JewelButton type="button" aria-pressed={tool === "draw"} onClick={() => actions.setTool("draw")}>
            Draw points
          </JewelButton>
          <JewelButton type="button" aria-pressed={tool === "probe"} onClick={() => actions.setTool("probe")}>
            Cast ray
          </JewelButton>
        </ButtonRow>
        <PanelHint>
          {tool === "draw"
            ? "Click the glass to add a point after the selected one. Drag points to reshape; square points mark where each subpath starts."
            : "Hover to preview a ray from the pointer, click to pin it. Drag the red knob to aim it."}
        </PanelHint>

        <SubpathList aria-label="Subpaths">
          {subpaths.map((subpath, index) => {
            const isActive = index === activeSubpath;
            return (
              <SubpathRow key={index} data-active={isActive ? "true" : undefined}>
                <SubpathName type="button" aria-pressed={isActive} onClick={() => actions.setActiveSubpath(index)}>
                  <Quarry aria-hidden="true" data-active={isActive ? "true" : undefined} />
                  Subpath {index + 1}
                </SubpathName>
                <SubpathMeta>
                  {subpath.nodes.length} {subpath.nodes.length === 1 ? "point" : "points"}
                  {subpath.nodes.length > 2 && ` · ${describeOrientation(geometry.areas[index] ?? 0)}`}
                </SubpathMeta>
                <JewelButton type="button" onClick={() => actions.reverseSubpath(index)} disabled={subpath.nodes.length < 2} aria-label={`Reverse subpath ${index + 1}`}>
                  <SwapIcon size={14} aria-hidden="true" />
                  Reverse
                </JewelButton>
                <JewelButton type="button" onClick={() => actions.deleteSubpath(index)} aria-label={`Delete subpath ${index + 1}`}>
                  <TrashIcon size={14} aria-hidden="true" />
                </JewelButton>
              </SubpathRow>
            );
          })}
        </SubpathList>

        <ButtonRow>
          <JewelButton type="button" onClick={actions.addSubpath}>
            <PlusIcon size={14} aria-hidden="true" />
            New subpath
          </JewelButton>
          <JewelButton type="button" onClick={handleAddPoint}>
            Add point
          </JewelButton>
          {selection && selectedNode && (
            <>
              <JewelButton type="button" onClick={() => actions.toggleCurve(selection.subpath, selection.node)}>
                {selectedNode.c1 && selectedNode.c2 ? "Straighten edge in" : "Curve edge in"}
              </JewelButton>
              <JewelButton type="button" onClick={() => actions.deleteNode(selection.subpath, selection.node)}>
                Delete point {selection.node + 1}
              </JewelButton>
            </>
          )}
        </ButtonRow>
        <PanelHint>
          Reverse an inner subpath to flip every one of its crossings from <code>+1</code> to <code>−1</code>: under nonzero, a ring drawn the same way as its
          outline fills in, while one drawn the opposite way cancels it out and leaves a hole. Evenodd doesn&apos;t care either way.
        </PanelHint>

        <FieldLabel htmlFor={`${fieldId}-d`}>
          Path data (<code>d</code>)
        </FieldLabel>
        <PathTextarea
          id={`${fieldId}-d`}
          value={draft ?? geometry.d}
          spellCheck={false}
          aria-describedby={message ? `${fieldId}-message` : undefined}
          onChange={(event) => {
            setDraft(event.target.value);
            setMessage(null);
          }}
        />
        <ButtonRow>
          <JewelButton type="button" onClick={handleApply} disabled={draft === null}>
            Apply path
          </JewelButton>
          <JewelButton
            type="button"
            disabled={draft === null}
            onClick={() => {
              setDraft(null);
              setMessage(null);
            }}
          >
            Discard edits
          </JewelButton>
        </ButtonRow>
        {message && (
          <FieldMessage id={`${fieldId}-message`} role={message.error ? "alert" : "status"} data-error={message.error ? "true" : undefined}>
            {message.text}
          </FieldMessage>
        )}
      </SectionCard>
    </>
  );
}

PathControls.displayName = "PathControls";
