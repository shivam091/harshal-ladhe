"use client";

import { useId, useState, useSyncExternalStore } from "react";
import type { JSX } from "react";
import { PlayIcon } from "@/components/Icon";
import { CheckboxInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { SectionCard, PanelTitle } from "@/components/KeyframesBuilder/KeyframesBuilder.styles";
import { compileAnimationLonghands, compileKeyframes, formatNumber, resolveStopPose, sortStops } from "@/utils/keyframes-builder";
import { Stage, Cel, Ghost, GhostLabel, Transport, TransportButton, ToggleLabel, Readout, ReadoutCell, Swatch } from "@/components/KeyframesBuilder/PreviewStage/PreviewStage.styles";
import type { KeyframesPlayback, PreviewStageProps } from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// Two-bar pause glyph drawn inline — the shared icon registry has a play icon but no pause, and this is the only place one is needed.
function PauseGlyph(): JSX.Element {
  return (
    <>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    </>
  );
}

PauseGlyph.displayName = "PauseGlyph";

/*
  The subject's real computed values at the playhead, read back from the browser rather than
  recomputed — so when the preview is paused on a moment, these are exactly the values CSS
  interpolated there, easing and all.
*/
function PlayheadReadoutStrip({ playback }: { playback: KeyframesPlayback }): JSX.Element {
  const { readout } = useSyncExternalStore(playback.subscribe, playback.getSnapshot, playback.getSnapshot);
  const cells = readout
    ? [
        { term: "Translate X", value: `${Math.round(readout.translateX)}px` },
        { term: "Translate Y", value: `${Math.round(readout.translateY)}px` },
        { term: "Rotate", value: `${Math.round(readout.rotate)}°` },
        { term: "Scale", value: formatNumber(readout.scale) },
        { term: "Opacity", value: formatNumber(readout.opacity) },
        { term: "Radius", value: `${Math.round(readout.borderRadius)}px` }
      ]
    : [];

  return (
    <>
      <Readout aria-label="Values at the playhead">
        {cells.map((cell) => (
          <ReadoutCell key={cell.term}>
            <dt>{cell.term}</dt>
            <dd>{cell.value}</dd>
          </ReadoutCell>
        ))}
        {readout && (
          <ReadoutCell>
            <dt>Background</dt>
            <dd>
              <Swatch style={{ background: readout.backgroundColor }} aria-hidden="true" />
              {readout.backgroundColor.replace(/\s+/g, "")}
            </dd>
          </ReadoutCell>
        )}
      </Readout>
    </>
  );
}

PlayheadReadoutStrip.displayName = "PlayheadReadoutStrip";

/*
  Runs the real generated @keyframes on a real element: the compiled block is injected through a
  <style> tag under a per-instance name (from useId), so the preview never collides with — or gets
  restyled by — any page keyframes that happen to share the user's chosen name, and renaming the
  animation doesn't restart it. Editing stops rewrites the rule in place; the browser updates the
  running animation without resetting its clock.
*/
export default function PreviewStage({ state, playback }: PreviewStageProps): JSX.Element {
  const reactId = useId();
  const previewName = `kfb-preview-${reactId.replace(/[^a-zA-Z0-9-]/g, "")}`;
  const [showOnionSkin, setShowOnionSkin] = useState(true);
  const keyframesCss = compileKeyframes(state.stops, previewName);
  // Destructured up front so the callback ref is a standalone value — handing `playback.setTarget` to `ref` directly would make the React compiler treat the whole playback object as a ref.
  const { setTarget, isPlaying, toggle, restart } = playback;

  return (
    <>
      <SectionCard aria-labelledby="keyframes-preview-title">
        <PanelTitle id="keyframes-preview-title">Preview</PanelTitle>
        <style>{keyframesCss}</style>

        <Stage>
          {showOnionSkin &&
            sortStops(state.stops).map((stop) => {
              const pose = resolveStopPose(state.stops, stop);
              return (
                <Ghost
                  key={stop.id}
                  aria-hidden="true"
                  data-selected={stop.id === state.selectedStopId ? "true" : undefined}
                  style={{
                    transform: `translateX(${pose.translateX}px) translateY(${pose.translateY}px) rotate(${pose.rotate}deg) scale(${pose.scale})`,
                    borderRadius: `${pose.borderRadius}px`
                  }}
                >
                  <GhostLabel>{stop.offset}%</GhostLabel>
                </Ghost>
              );
            })}
          <Cel ref={setTarget} role="img" aria-label="Animated preview subject" style={compileAnimationLonghands(state.settings, previewName)} />
        </Stage>

        <Transport>
          <TransportButton type="button" data-primary="true" onClick={toggle}>
            {isPlaying ? <PauseGlyph /> : <PlayIcon size={16} />}
            {isPlaying ? "Pause" : "Play"}
          </TransportButton>
          <TransportButton type="button" onClick={restart}>
            Restart
          </TransportButton>
          <ToggleLabel>
            <CheckboxInput type="checkbox" checked={showOnionSkin} onChange={(event) => setShowOnionSkin(event.target.checked)} />
            Onion skin
          </ToggleLabel>
        </Transport>

        <PlayheadReadoutStrip playback={playback} />
      </SectionCard>
    </>
  );
}

PreviewStage.displayName = "PreviewStage";
