"use client";

import { useRef } from "react";
import type { JSX, KeyboardEvent, PointerEvent } from "react";
import { PlayIcon } from "@/components/Icon";
import { DIAL_SWEEP_DEG, dialAngleToProgress, dialArc, dialPoint, keyframeLabel, progressToDialAngle } from "@/components/SvgPathMorph/SvgPathMorph.utils";
import { AstrolabeFrame, Dial, DialSvg, HubButton, Readout } from "@/components/SvgPathMorph/Astrolabe/Astrolabe.styles";
import type { AstrolabeProps } from "@/components/SvgPathMorph/SvgPathMorph.types";

// The dial's centre in its own 220-unit drawing.
const C = 110;

// Fine and coarse keyboard steps — 1% for nudging onto an exact frame, 10% for crossing the dial quickly.
const FINE_STEP = 0.01;
// PageUp/PageDown step, for crossing the dial quickly.
const COARSE_STEP = 0.1;

// Two-bar pause glyph drawn inline — the shared icon registry has a play icon but no pause.
function PauseGlyph(): JSX.Element {
  return (
    <>
      <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    </>
  );
}

PauseGlyph.displayName = "PauseGlyph";

// Tick angles round the limb: a long tick every 10%, short ones every 2.5% between.
const TICKS = Array.from({ length: 41 }, (_, i) => ({ angle: progressToDialAngle(i / 40), major: i % 4 === 0 }));

/*
  A brass astrolabe as the timeline: the alidade (the rotating sighting rule) is the playhead, the
  limb is graduated in tenths of the pass, and each keyframe is marked round the rim with its
  letter. It's a real slider — focusable, arrow/Page/Home/End keys, dragging anywhere on the face —
  and the play/pause knob sits at the hub where the rete's pin would be.
*/
export default function Astrolabe({ playback, keyframeCount, disabled }: AstrolabeProps): JSX.Element {
  const dialRef = useRef<HTMLDivElement>(null);
  const { progress, isPlaying, toggle, seek } = playback;
  const angle = progressToDialAngle(progress);
  const start = -DIAL_SWEEP_DEG / 2;
  const legs = Math.max(1, keyframeCount - 1);
  const leg = Math.min(Math.floor(progress * legs), legs - 1);
  const percent = Math.round(progress * 100);
  const valueText = `${percent}% — between ${keyframeLabel(leg)} and ${keyframeLabel(leg + 1)}`;
  const tip = dialPoint(C, C, 92, angle);
  const tail = dialPoint(C, C, 44, angle + 180);

  // Maps a pointer position on the face to progress via its angle from the centre.
  function seekFromPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = dialRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    seek(dialAngleToProgress((Math.atan2(dx, -dy) * 180) / Math.PI));
  }

  // Captures the pointer so a drag that wanders off the face keeps scrubbing until release.
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    seekFromPointer(event);
  }

  // Only scrubs during a captured drag — plain hovering over the dial mustn't move the playhead.
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    seekFromPointer(event);
  }

  // Standard slider keys, so the dial is as operable from a keyboard as a native range input.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const steps: Record<string, number> = { ArrowRight: FINE_STEP, ArrowUp: FINE_STEP, ArrowLeft: -FINE_STEP, ArrowDown: -FINE_STEP, PageUp: COARSE_STEP, PageDown: -COARSE_STEP };
    if (event.key in steps) seek(progress + steps[event.key]);
    else if (event.key === "Home") seek(0);
    else if (event.key === "End") seek(1);
    else return;
    event.preventDefault();
  }

  return (
    <>
      <AstrolabeFrame>
        <Dial
          ref={dialRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label="Morph timeline"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={valueText}
          aria-disabled={disabled || undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onKeyDown={handleKeyDown}
        >
          <DialSvg viewBox="0 0 220 220" aria-hidden="true">
            <circle className="mater" cx={C} cy={C} r={106} />
            <circle className="limb" cx={C} cy={C} r={98} />
            <path className="track" d={dialArc(C, C, 86, start, start + DIAL_SWEEP_DEG)} />
            {progress > 0.001 && <path className="filled" d={dialArc(C, C, 86, start, angle)} />}
            {TICKS.map((tick, i) => {
              const outer = dialPoint(C, C, 97, tick.angle);
              const inner = dialPoint(C, C, tick.major ? 89 : 93, tick.angle);
              return <line key={i} className={tick.major ? "tick major" : "tick"} x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} />;
            })}
            <circle className="rete" cx={C} cy={C} r={62} />
            <circle className="rete" cx={C} cy={C + 14} r={42} />
            <circle className="rete" cx={C} cy={C} r={26} />
            {Array.from({ length: keyframeCount }, (_, i) => {
              const at = progressToDialAngle(i / legs);
              const mark = dialPoint(C, C, 72, at);
              const pin = dialPoint(C, C, 84, at);
              return (
                <g key={i} className="keyframe-mark" data-active={i === leg || i === leg + 1 ? "true" : undefined}>
                  <circle cx={pin.x} cy={pin.y} r={3.2} />
                  <text x={mark.x} y={mark.y} textAnchor="middle" dominantBaseline="central">
                    {keyframeLabel(i)}
                  </text>
                </g>
              );
            })}
            <g className="alidade">
              <line x1={tail.x} y1={tail.y} x2={tip.x} y2={tip.y} />
              <circle cx={tip.x} cy={tip.y} r={5} />
            </g>
          </DialSvg>
        </Dial>
        <HubButton type="button" onClick={toggle} disabled={disabled} aria-label={isPlaying ? "Pause the morph" : "Play the morph"} aria-pressed={isPlaying}>
          {isPlaying ? <PauseGlyph /> : <PlayIcon size={18} />}
        </HubButton>
      </AstrolabeFrame>
      <Readout aria-hidden="true">{disabled ? "—" : valueText}</Readout>
    </>
  );
}

Astrolabe.displayName = "Astrolabe";
