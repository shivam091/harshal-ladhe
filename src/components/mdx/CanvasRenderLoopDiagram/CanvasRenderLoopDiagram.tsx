import type { JSX } from "react";
import {
  MONO_FONT,
  BOX_H,
  ARROW_TONES,
  STATE_LOOP_BOXES,
  STATE_LOOP_ARROWS,
  REF_LOOP_BOXES,
  REF_LOOP_ARROWS
} from "@/components/mdx/CanvasRenderLoopDiagram/CanvasRenderLoopDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/CanvasRenderLoopDiagram/CanvasRenderLoopDiagram.styles";

// Per-frame cost is invisible in code; a long lane next to a short one makes the useState overhead obvious.
export default function CanvasRenderLoopDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 680 410" role="img" aria-labelledby="canvas-render-loop-diagram-title canvas-render-loop-diagram-desc">
          <title id="canvas-render-loop-diagram-title">useState animation loop versus ref animation loop, per frame</title>
          <desc id="canvas-render-loop-diagram-desc">
            Two loops, each showing the work done on every animation frame. The top loop, driven by useState, runs
            seven steps per frame: requestAnimationFrame, then setX(), then a React re-render, reconcile, commit and
            useEffect, then finally draw, before returning to requestAnimationFrame for the next frame. The four
            middle steps — re-render, reconcile, commit and useEffect — are highlighted as React work happening up
            to 60 times a second. The bottom loop, driven by a ref, runs only three steps per frame:
            requestAnimationFrame, then x += dx, then draw, before returning for the next frame. React is not
            involved in the ref loop after the component mounts.
          </desc>

          <defs>
            {Object.values(ARROW_TONES).map((tone) => (
              <marker key={tone.marker} id={tone.marker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 Z" fill={tone.stroke} />
              </marker>
            ))}
          </defs>

          <rect x={15} y={20} width={650} height={224} rx={12} fill="none" stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} />
          <text x={31} y={48} fontSize={15} fontWeight={600} fill="var(--color-fg-danger)">useState loop — every frame</text>

          <rect x={383} y={60} width={276} height={170} rx={10} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" strokeWidth={1.5} strokeDasharray="5 4" />
          <text x={521} y={220} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-attention)">React work × 60/sec</text>

          {STATE_LOOP_BOXES.map((box) => (
            <g key={`state-${box.label}`}>
              <rect x={box.x} y={box.y} width={box.w} height={BOX_H} rx={6} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
              <text x={box.x + box.w / 2} y={box.y + BOX_H / 2 + 5} textAnchor="middle" fontSize={13} fontFamily={box.mono ? MONO_FONT : undefined} fill="var(--color-fg-default)">
                {box.label}
              </text>
            </g>
          ))}

          {STATE_LOOP_ARROWS.map((arrow) => (
            <path key={arrow.d} d={arrow.d} fill="none" stroke={ARROW_TONES[arrow.tone].stroke} strokeWidth={1.5} markerEnd={`url(#${ARROW_TONES[arrow.tone].marker})`} />
          ))}
          <text x={129} y={146} fontSize={12} fill="var(--color-fg-muted)">next frame</text>

          <rect x={15} y={260} width={650} height={136} rx={12} fill="none" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
          <text x={31} y={288} fontSize={15} fontWeight={600} fill="var(--color-fg-success)">ref loop — every frame</text>

          {REF_LOOP_BOXES.map((box) => (
            <g key={`ref-${box.label}`}>
              <rect x={box.x} y={box.y} width={box.w} height={BOX_H} rx={6} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
              <text x={box.x + box.w / 2} y={box.y + BOX_H / 2 + 5} textAnchor="middle" fontSize={13} fontFamily={box.mono ? MONO_FONT : undefined} fill="var(--color-fg-default)">
                {box.label}
              </text>
            </g>
          ))}

          {REF_LOOP_ARROWS.map((arrow) => (
            <path key={arrow.d} d={arrow.d} fill="none" stroke={ARROW_TONES[arrow.tone].stroke} strokeWidth={1.5} markerEnd={`url(#${ARROW_TONES[arrow.tone].marker})`} />
          ))}
          <text x={284} y={384} textAnchor="middle" fontSize={12} fill="var(--color-fg-muted)">next frame</text>

          {/* Sits where the useState lane's React work would be, so its absence reads at a glance. */}
          <text x={584} y={316} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-success)">React isn&apos;t involved</text>
          <text x={584} y={334} textAnchor="middle" fontSize={13} fill="var(--color-fg-success)">after mount</text>
        </Svg>
      </Wrapper>
    </>
  );
}

CanvasRenderLoopDiagram.displayName = "CanvasRenderLoopDiagram";
