"use client";

import type { JSX } from "react";
import { MAX_START_OFFSET } from "@/components/SvgPathMorph/SvgPathMorph.helpers";
import Slider from "@/components/SvgPathMorph/Slider/Slider";
import { ParchmentCard, PanelTitle, PanelHint, ToggleLabel, ControlRow } from "@/components/SvgPathMorph/SvgPathMorph.styles";
import type { AlignmentControlsProps } from "@/components/SvgPathMorph/SvgPathMorph.types";

// Signed offsets read as a twist one way or the other, so the bubble always shows the sign.
function formatOffset(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

/*
  The matcher's alignment knobs. Auto picks each keyframe's start point (and, if allowed, its
  direction) to minimise how far the points travel; the offset then twists on top of that for the
  times a deliberate spin looks better than the shortest route.
*/
export default function AlignmentControls({ state, actions }: AlignmentControlsProps): JSX.Element {
  return (
    <>
      <ParchmentCard aria-labelledby="morph-alignment-title">
        <PanelTitle id="morph-alignment-title">Alignment</PanelTitle>
        <ControlRow>
          <ToggleLabel>
            <input type="checkbox" checked={state.autoAlign} onChange={(event) => actions.setSetting("autoAlign", event.target.checked)} />
            Auto-align start points
          </ToggleLabel>
          <ToggleLabel>
            <input
              type="checkbox"
              checked={state.allowReverse}
              disabled={!state.autoAlign}
              onChange={(event) => actions.setSetting("allowReverse", event.target.checked)}
            />
            Allow reversing direction
          </ToggleLabel>
        </ControlRow>
        <Slider
          id="morph-start-offset"
          label="Manual start-point offset (segments)"
          min={-MAX_START_OFFSET}
          max={MAX_START_OFFSET}
          value={state.startOffset}
          format={formatOffset}
          onChange={(value) => actions.setSettingLive("startOffset", value)}
          onCommit={actions.commitEdit}
        />
        <PanelHint>Closed subpaths only — an open line can be reversed, but rotating it would move its gap.</PanelHint>
      </ParchmentCard>
    </>
  );
}

AlignmentControls.displayName = "AlignmentControls";
