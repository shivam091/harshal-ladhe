"use client";

import type { JSX } from "react";
import { PlusIcon, SwapIcon, TrashIcon } from "@/components/Icon";
import { MAX_KEYFRAMES, MIN_KEYFRAMES, elixirTone, keyframeLabel } from "@/components/SvgPathMorph/SvgPathMorph.utils";
import { ParchmentCard, PanelTitle, PanelHint, BrassButton, ControlRow } from "@/components/SvgPathMorph/SvgPathMorph.styles";
import { LabelList, Label, LabelHeader, LabelLetter, PathInput, LabelError, RemoveButton } from "@/components/SvgPathMorph/KeyframeLabels/KeyframeLabels.styles";
import type { KeyframeLabelsProps } from "@/components/SvgPathMorph/SvgPathMorph.types";

/*
  One parchment label per keyframe, each holding its raw `d` string. Typing updates live (the
  matcher re-runs underneath) and blurring checkpoints the edit for undo; a path that won't parse
  keeps its text and shows why beneath, rather than being reverted out from under the typist.
*/
export default function KeyframeLabels({ state, actions, errors }: KeyframeLabelsProps): JSX.Element {
  const count = state.keyframes.length;

  return (
    <>
      <ParchmentCard aria-labelledby="morph-labels-title">
        <PanelTitle id="morph-labels-title">Ingredients</PanelTitle>
        <PanelHint>
          Paste any SVG path <code>d</code> — every command works, relative or absolute, arcs included. Keyframes morph in order, A first.
        </PanelHint>
        <LabelList>
          {state.keyframes.map((d, index) => {
            const letter = keyframeLabel(index);
            const error = errors[index];
            const inputId = `morph-keyframe-${index}`;
            const errorId = `${inputId}-error`;
            return (
              <Label key={index} data-invalid={error ? "true" : undefined}>
                <LabelHeader>
                  <LabelLetter htmlFor={inputId} style={{ color: elixirTone(index) }}>
                    Keyframe {letter}
                  </LabelLetter>
                  {count > MIN_KEYFRAMES && (
                    <RemoveButton type="button" onClick={() => actions.removeKeyframe(index)} aria-label={`Remove keyframe ${letter}`}>
                      <TrashIcon size={14} />
                    </RemoveButton>
                  )}
                </LabelHeader>
                <PathInput
                  id={inputId}
                  value={d}
                  rows={3}
                  spellCheck={false}
                  autoComplete="off"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  onChange={(event) => actions.setKeyframe(index, event.target.value)}
                  onBlur={actions.commitEdit}
                />
                {error && <LabelError id={errorId}>{error}</LabelError>}
              </Label>
            );
          })}
        </LabelList>
        <ControlRow>
          <BrassButton type="button" onClick={actions.addKeyframe} disabled={count >= MAX_KEYFRAMES}>
            <PlusIcon size={14} /> Add keyframe
          </BrassButton>
          <BrassButton type="button" onClick={actions.reverseKeyframes}>
            <SwapIcon size={14} /> Reverse order
          </BrassButton>
        </ControlRow>
      </ParchmentCard>
    </>
  );
}

KeyframeLabels.displayName = "KeyframeLabels";
