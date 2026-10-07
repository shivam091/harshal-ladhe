"use client";

import { useState } from "react";
import type { JSX } from "react";
import { MORPH_EASINGS, keyframeLabel } from "@/components/SvgPathMorph/SvgPathMorph.utils";
import { MAX_DURATION_MS, MIN_DURATION_MS, useMorphPlayback } from "@/components/SvgPathMorph/SvgPathMorph.helpers";
import Flask from "@/components/SvgPathMorph/Flask/Flask";
import Alembic from "@/components/SvgPathMorph/Alembic/Alembic";
import Astrolabe from "@/components/SvgPathMorph/Astrolabe/Astrolabe";
import Slider from "@/components/SvgPathMorph/Slider/Slider";
import { ParchmentCard, PanelTitle, ToggleLabel, ControlRow } from "@/components/SvgPathMorph/SvgPathMorph.styles";
import { BenchTop, Instruments, DialColumn, ControlsColumn, SelectField, SelectLabel, Select } from "@/components/SvgPathMorph/MorphBench/MorphBench.styles";
import type { CubicShape, MorphBenchProps, MorphEasingId } from "@/components/SvgPathMorph/SvgPathMorph.types";
// "12 points · 2 subpaths" — the flask tag's tally of what the matcher produced for that keyframe.
function flaskCaption(shape: CubicShape | null): string {
  if (!shape) return "won't parse";
  const points = shape.reduce((sum, subpath) => sum + subpath.segments.length + (subpath.closed ? 0 : 1), 0);
  return `${points} points · ${shape.length} subpath${shape.length === 1 ? "" : "s"}`;
}

/*
  The bench top: the current leg's two keyframes in flasks either side of the alembic, with the
  astrolabe and the preview controls beneath. It owns playback and the view toggles (onion skins,
  points, travel lines) — none of which are part of the recipe, so none go through undo.
*/
export default function MorphBench({ state, actions, outcome }: MorphBenchProps): JSX.Element {
  const keyframeCount = state.keyframes.length;
  const playback = useMorphPlayback(state.durationMs * (keyframeCount - 1), outcome.ok);
  const [onionSkins, setOnionSkins] = useState(2);
  const [showPoints, setShowPoints] = useState(true);
  const [showTravel, setShowTravel] = useState(false);

  const result = outcome.ok ? outcome.result : null;
  const legs = Math.max(1, keyframeCount - 1);
  const leg = Math.min(Math.floor(playback.progress * legs), legs - 1);
  const fromShape = result ? result.shapes[leg] : null;
  const toShape = result ? result.shapes[leg + 1] : null;

  return (
    <>
      <BenchTop aria-label="Morph preview">
        <Flask
          label={keyframeLabel(leg)}
          caption={flaskCaption(fromShape)}
          shape={fromShape}
          viewBox={result?.viewBox ?? null}
          renderMode={state.renderMode}
          showPoints={showPoints}
          side="start"
          toneIndex={leg}
        />
        <Alembic
          shapes={result?.shapes ?? null}
          viewBox={result?.viewBox ?? null}
          renderMode={state.renderMode}
          progress={playback.progress}
          easing={state.easing}
          onionSkins={onionSkins}
          showPoints={showPoints}
          showTravel={showTravel}
          error={outcome.ok ? null : `Keyframe ${keyframeLabel(outcome.keyframeIndex)}: ${outcome.error}`}
          isPlaying={playback.isPlaying}
        />
        <Flask
          label={keyframeLabel(leg + 1)}
          caption={flaskCaption(toShape)}
          shape={toShape}
          viewBox={result?.viewBox ?? null}
          renderMode={state.renderMode}
          showPoints={showPoints}
          side="end"
          toneIndex={leg + 1}
        />
      </BenchTop>

      <ParchmentCard aria-labelledby="morph-instruments-title">
        <PanelTitle id="morph-instruments-title">Instruments</PanelTitle>
        <Instruments>
          <DialColumn>
            <Astrolabe playback={playback} keyframeCount={keyframeCount} disabled={!outcome.ok} />
          </DialColumn>
          <ControlsColumn>
            <Slider
              id="morph-speed"
              label="Preview speed"
              min={0.25}
              max={2}
              step={0.25}
              value={playback.speed}
              format={(value) => `${value}×`}
              onChange={playback.setSpeed}
              onCommit={() => {}}
            />
            <Slider
              id="morph-duration"
              label="Duration per morph"
              min={MIN_DURATION_MS}
              max={MAX_DURATION_MS}
              step={50}
              value={state.durationMs}
              format={(value) => `${value}ms`}
              onChange={(value) => actions.setSettingLive("durationMs", value)}
              onCommit={actions.commitEdit}
            />
            <SelectField>
              <SelectLabel htmlFor="morph-easing">Easing</SelectLabel>
              <Select id="morph-easing" value={state.easing} onChange={(event) => actions.setSetting("easing", event.target.value as MorphEasingId)}>
                {MORPH_EASINGS.map((easing) => (
                  <option key={easing.id} value={easing.id}>
                    {easing.label}
                  </option>
                ))}
              </Select>
            </SelectField>
            <Slider id="morph-onion" label="Onion-skin ghosts" min={0} max={4} value={onionSkins} onChange={setOnionSkins} onCommit={() => {}} />
            <ControlRow>
              <ToggleLabel>
                <input type="checkbox" checked={showPoints} onChange={(event) => setShowPoints(event.target.checked)} />
                Matched points
              </ToggleLabel>
              <ToggleLabel>
                <input type="checkbox" checked={showTravel} onChange={(event) => setShowTravel(event.target.checked)} />
                Travel lines
              </ToggleLabel>
              <ToggleLabel>
                <input
                  type="checkbox"
                  checked={state.renderMode === "stroke"}
                  onChange={(event) => actions.setSetting("renderMode", event.target.checked ? "stroke" : "fill")}
                />
                Stroke instead of fill
              </ToggleLabel>
            </ControlRow>
          </ControlsColumn>
        </Instruments>
      </ParchmentCard>
    </>
  );
}

MorphBench.displayName = "MorphBench";
