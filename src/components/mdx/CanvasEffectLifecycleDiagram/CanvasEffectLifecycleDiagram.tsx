import type { JSX } from "react";
import {
  MONO_FONT,
  MAIN_Y,
  MAIN_H,
  STRICT_Y,
  STRICT_H,
  TONE_STYLES,
  MAIN_PHASES,
  MAIN_NOTES,
  STRICT_PHASES
} from "@/components/mdx/CanvasEffectLifecycleDiagram/CanvasEffectLifecycleDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/CanvasEffectLifecycleDiagram/CanvasEffectLifecycleDiagram.styles";

// Cleanup only feels optional until you see Strict Mode run setup twice; the timeline makes that pairing explicit.
export default function CanvasEffectLifecycleDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 702 266" role="img" aria-labelledby="canvas-effect-lifecycle-diagram-title canvas-effect-lifecycle-diagram-desc">
          <title id="canvas-effect-lifecycle-diagram-title">Lifecycle of a canvas effect in React</title>
          <desc id="canvas-effect-lifecycle-diagram-desc">
            A left-to-right timeline. First, render: the component returns its JSX. Then commit: React attaches the
            canvas element to canvasRef.current. Then effect setup: the effect calls getContext(), adds event
            listeners, and starts the requestAnimationFrame loop or a worker. Next comes the longest span, where the
            loop runs with no re-renders. Then unmount, when the component leaves the page, followed by cleanup:
            cancelAnimationFrame(), removeEventListener() and worker.terminate(). Beneath the timeline, a second row
            labelled Strict Mode, development only, shows that straight after commit React runs setup, then
            cleanup, then setup again — so cleanup must fully undo setup.
          </desc>

          <defs>
            <marker id="canvas-effect-lifecycle-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {MAIN_PHASES.slice(1).map((phase, i) => (
            <line
              key={`main-arrow-${phase.label}`}
              x1={MAIN_PHASES[i].x + MAIN_PHASES[i].w + 2}
              y1={MAIN_Y + MAIN_H / 2}
              x2={phase.x - 2}
              y2={MAIN_Y + MAIN_H / 2}
              stroke="var(--color-fg-muted)"
              strokeWidth={1.5}
              markerEnd="url(#canvas-effect-lifecycle-arrow)"
            />
          ))}

          {MAIN_PHASES.map((phase) => (
            <g key={`main-${phase.label}`}>
              <rect
                x={phase.x}
                y={MAIN_Y}
                width={phase.w}
                height={MAIN_H}
                rx={6}
                fill={TONE_STYLES[phase.tone].fill}
                stroke={TONE_STYLES[phase.tone].stroke}
                strokeWidth={1.5}
                strokeDasharray={TONE_STYLES[phase.tone].dash}
              />
              <text x={phase.x + phase.w / 2} y={MAIN_Y + MAIN_H / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill={TONE_STYLES[phase.tone].text}>
                {phase.label}
              </text>
            </g>
          ))}

          {MAIN_NOTES.map((note) => (
            <text key={`note-${note.text}`} x={note.x} y={note.y} textAnchor={note.anchor} fontSize={12} fontFamily={note.mono ? MONO_FONT : undefined} fill="var(--color-fg-muted)">
              {note.text}
            </text>
          ))}

          <rect x={8} y={172} width={686} height={84} rx={10} fill="none" stroke="var(--color-border-muted)" strokeWidth={1.5} />
          <text x={24} y={194} fontSize={13} fontWeight={600} fill="var(--color-fg-attention)">Strict Mode (development only)</text>

          {STRICT_PHASES.slice(1).map((phase, i) => (
            <line
              key={`strict-arrow-${phase.x}`}
              x1={STRICT_PHASES[i].x + STRICT_PHASES[i].w + 2}
              y1={STRICT_Y + STRICT_H / 2}
              x2={phase.x - 2}
              y2={STRICT_Y + STRICT_H / 2}
              stroke="var(--color-fg-muted)"
              strokeWidth={1.5}
              markerEnd="url(#canvas-effect-lifecycle-arrow)"
            />
          ))}

          {STRICT_PHASES.map((phase) => (
            <g key={`strict-${phase.x}`}>
              <rect
                x={phase.x}
                y={STRICT_Y}
                width={phase.w}
                height={STRICT_H}
                rx={6}
                fill={TONE_STYLES[phase.tone].fill}
                stroke={TONE_STYLES[phase.tone].stroke}
                strokeWidth={1.5}
                strokeDasharray={TONE_STYLES[phase.tone].dash}
              />
              <text x={phase.x + phase.w / 2} y={STRICT_Y + STRICT_H / 2 + 4} textAnchor="middle" fontSize={12} fill={TONE_STYLES[phase.tone].text}>
                {phase.label}
              </text>
            </g>
          ))}

          <text x={452} y={STRICT_Y + STRICT_H / 2 + 5} fontSize={13} fontWeight={600} fill="var(--color-fg-danger)">cleanup must fully undo setup</text>
        </Svg>
      </Wrapper>
    </>
  );
}

CanvasEffectLifecycleDiagram.displayName = "CanvasEffectLifecycleDiagram";
