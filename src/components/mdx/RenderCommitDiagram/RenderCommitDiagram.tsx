import type { JSX } from "react";
import {
  RENDER_COMMIT_GROUPS,
  RENDER_COMMIT_PHASES,
  DIVIDER_X,
  DIVIDER_Y_TOP,
  DIVIDER_Y_BOTTOM,
  GROUP_LABEL_Y,
  GROUP_SUBLABEL_Y
} from "@/components/mdx/RenderCommitDiagram/RenderCommitDiagram.constants";
import { getRenderCommitGroupStyle } from "@/components/mdx/RenderCommitDiagram/RenderCommitDiagram.helpers";
import {
  Wrapper,
  Svg,
  headingTextClass,
  captionTextClass,
  noteTextClass
} from "@/components/mdx/RenderCommitDiagram/RenderCommitDiagram.styles";

/*
  Static SVG diagram of React's four-stage rendering pipeline. The one thing it exists to make obvious
  at a glance: Render + Reconcile (left band) can be paused, thrown away, or restarted and never touch
  the DOM, while Commit + Paint (right band) are synchronous and are where the DOM actually changes —
  the dashed divider between them is the post's central boundary, drawn bolder than any other line here.
*/
export default function RenderCommitDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 720 300" role="img" aria-labelledby="render-commit-diagram-title">
          <title id="render-commit-diagram-title">
            Diagram of React&apos;s rendering pipeline: Render and Reconcile form the interruptible render
            phase with no DOM access, and Commit and Paint form the synchronous commit phase where the DOM
            is mutated and the browser paints.
          </title>

          <defs>
            <marker id="render-commit-arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            <marker id="render-commit-arrow-strong" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-default)" />
            </marker>
          </defs>

          {/* Group bands, drawn first so phase boxes and arrows layer on top of them. */}
          {RENDER_COMMIT_GROUPS.map((group) => {
            const style = getRenderCommitGroupStyle(group.kind);
            return (
              <g key={group.kind}>
                <rect
                  x={group.x}
                  y={group.y}
                  width={group.w}
                  height={group.h}
                  rx={14}
                  fill={style.bandFill}
                  stroke={style.bandStroke}
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                />
                <text x={group.x + group.w / 2} y={GROUP_LABEL_Y} textAnchor="middle" fontSize={13} fill={style.labelColor} className={headingTextClass}>
                  {group.label}
                </text>
                <text x={group.x + group.w / 2} y={GROUP_SUBLABEL_Y} textAnchor="middle" className={captionTextClass}>
                  {group.sublabel}
                </text>
              </g>
            );
          })}

          {/* The boundary itself — bolder and more saturated than every other line in the diagram, on purpose. */}
          <line
            x1={DIVIDER_X}
            y1={DIVIDER_Y_TOP}
            x2={DIVIDER_X}
            y2={DIVIDER_Y_BOTTOM}
            stroke="var(--color-border-danger-emphasis)"
            strokeWidth={3}
            strokeDasharray="2 5"
            strokeLinecap="round"
          />

          {/* Restart loop — visual proof the render phase can be abandoned mid-flight and redone from scratch. */}
          <path d="M 245 120 Q 165 96 85 120" fill="none" stroke="var(--color-fg-accent)" strokeWidth={1.5} markerEnd="url(#render-commit-arrow-muted)" />
          <text x={165} y={107} textAnchor="middle" className={noteTextClass}>
            restart
          </text>

          {/* Phase boxes, left to right. */}
          {RENDER_COMMIT_PHASES.map((phase) => {
            const style = getRenderCommitGroupStyle(phase.group);
            return (
              <g key={phase.id}>
                <rect x={phase.x} y={phase.y} width={phase.w} height={phase.h} rx={10} fill={style.boxFill} stroke={style.boxStroke} strokeWidth={1.5} />
                <text x={phase.x + phase.w / 2} y={phase.y + 30} textAnchor="middle" fontSize={13} fill="var(--color-fg-default)" className={headingTextClass}>
                  {phase.label}
                </text>
                <text x={phase.x + phase.w / 2} y={phase.y + 50} textAnchor="middle" className={captionTextClass}>
                  {phase.caption}
                </text>
              </g>
            );
          })}

          {/* Connecting arrows — the one crossing the boundary (Reconcile → Commit) is drawn stronger than the other two. */}
          <line x1={150} y1={160} x2={180} y2={160} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#render-commit-arrow-muted)" />
          <line x1={310} y1={160} x2={390} y2={160} stroke="var(--color-fg-default)" strokeWidth={2.5} markerEnd="url(#render-commit-arrow-strong)" />
          <line x1={520} y1={160} x2={550} y2={160} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#render-commit-arrow-muted)" />

          <text x={360} y={280} textAnchor="middle" className={noteTextClass}>
            useLayoutEffect runs synchronously during commit, before paint — useEffect runs after
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

RenderCommitDiagram.displayName = "RenderCommitDiagram";
