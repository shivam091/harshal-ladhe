"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, JSX } from "react";
import { compileTimingFunction } from "@/utils/easing-curve-editor";
import { PlayIcon } from "@/components/Icon";
import type { PreviewPaneProps, PreviewSubject } from "@/interfaces/easing-curve-editor";
import { Stage, Track, Box, PlayRow, PlayButton } from "@/components/EasingCurveEditor/PreviewPane/PreviewPane.styles";

const TRAVEL_PX = 200;

/*
  Each subject's start/end inline styles — deliberately independent of state.property (which only
  labels the EXPORTED CSS's intended target). The preview's job is showing how the curve FEELS
  across a few representative kinds of motion, not literally animating whatever property the export
  panel happens to name — a box-shadow or border-color change wouldn't read as a meaningful preview
  the way a slide/scale/opacity/rotate does.
*/
const START_STYLE: Record<PreviewSubject, CSSProperties> = {
  slide: { transform: "translateY(-50%)" },
  scale: { transform: "translateY(-50%) scale(0.3)" },
  opacity: { transform: "translateY(-50%)", opacity: 0.15 },
  rotate: { transform: "translateY(-50%) rotate(0deg)" }
};

function endStyle(subject: PreviewSubject): CSSProperties {
  switch (subject) {
    case "slide":
      return { transform: `translate(${TRAVEL_PX}px, -50%)` };
    case "scale":
      return { transform: "translateY(-50%) scale(1)" };
    case "opacity":
      return { transform: "translateY(-50%)", opacity: 1 };
    case "rotate":
      return { transform: "translateY(-50%) rotate(180deg)" };
  }
}

// Runs one play of the current curve — remounted on every Play click (via `key`) so a fresh animation always starts from START_STYLE regardless of where the last one left off.
function PreviewRun({ subject, cssValue, durationMs, delayMs, onDone }: { subject: PreviewSubject; cssValue: string; durationMs: number; delayMs: number; onDone: () => void }): JSX.Element {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHasStarted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Box
        onTransitionEnd={onDone}
        style={{
          ...(hasStarted ? endStyle(subject) : START_STYLE[subject]),
          transitionProperty: subject === "opacity" ? "opacity" : "transform",
          transitionDuration: `${durationMs}ms`,
          transitionDelay: `${delayMs}ms`,
          transitionTimingFunction: cssValue
        }}
      />
    </>
  );
}

export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  const [playKey, setPlayKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const cssValue = compileTimingFunction(state);

  return (
    <>
      <Stage>
        <Track>
          {playKey > 0 ? (
            <PreviewRun
              key={playKey}
              subject={state.previewSubject}
              cssValue={cssValue}
              durationMs={state.durationMs}
              delayMs={state.delayMs}
              onDone={() => setIsPlaying(false)}
            />
          ) : (
            <Box style={START_STYLE[state.previewSubject]} />
          )}
        </Track>
      </Stage>

      <PlayRow>
        <PlayButton
          type="button"
          onClick={() => {
            setIsPlaying(true);
            setPlayKey((key) => key + 1);
          }}
          disabled={isPlaying}
          aria-label="Play preview"
        >
          <PlayIcon size={16} />
          Play
        </PlayButton>
      </PlayRow>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
