import type { JSX } from "react";
import {
  NODE_R, AUTH_X, LOGIN_X, LABEL_X, HEADING_Y, LANE_END_Y, BLAME_STEPS
} from "@/components/mdx/GitBlameCopyDiagram/GitBlameCopyDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GitBlameCopyDiagram/GitBlameCopyDiagram.styles";

/*
  Static SVG diagram of the post's own blame example — shows why each extra flag is needed by marking
  where every blame invocation would stop on the way back to the real author.
*/
export default function GitBlameCopyDiagram(): JSX.Element {
  const [written, moved, reindented] = BLAME_STEPS;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 440 260" role="img" aria-labelledby="git-blame-copy-diagram-title">
          <title id="git-blame-copy-diagram-title">
            Diagram of the login function&apos;s history across two files. Commit ad8066f writes it in
            src/auth.js, commit f77d8e7 moves it into src/login.js, and commit bc03c37 re-indents it. Plain git
            blame stops at the re-indent, git blame -w stops at the move, and git blame -w -C follows the move
            back to ad8066f, where the code was really written.
          </title>

          <defs>
            <marker id="git-blame-copy-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* File lanes — one dashed guide per file, so the move reads as a jump between them. */}
          <text x={AUTH_X} y={HEADING_Y} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">src/auth.js</text>
          <text x={LOGIN_X} y={HEADING_Y} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">src/login.js</text>
          <line x1={AUTH_X} y1={HEADING_Y + 12} x2={AUTH_X} y2={LANE_END_Y} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="3 4" />
          <line x1={LOGIN_X} y1={HEADING_Y + 12} x2={LOGIN_X} y2={LANE_END_Y} stroke="var(--color-border-muted)" strokeWidth={1} strokeDasharray="3 4" />

          {/* History arrows — so readers can trace the line back through both commits that hide its author. */}
          <line
            x1={written.x + NODE_R} y1={written.y + 4} x2={moved.x - NODE_R - 2} y2={moved.y - 4}
            stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#git-blame-copy-arrow)"
          />
          <text x={(written.x + moved.x) / 2 - 6} y={(written.y + moved.y) / 2 + 14} textAnchor="end" fontSize={9} fill="var(--color-fg-muted)">moved</text>
          <line
            x1={moved.x} y1={moved.y + NODE_R} x2={reindented.x} y2={reindented.y - NODE_R - 2}
            stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#git-blame-copy-arrow)"
          />

          {BLAME_STEPS.map((step) => (
            <g key={step.sha}>
              <circle
                cx={step.x} cy={step.y} r={NODE_R}
                fill={step.emphasis ? "var(--color-bg-accent-muted)" : "var(--color-bg-muted)"}
                stroke={step.emphasis ? "var(--color-border-accent-emphasis)" : "var(--color-border-default)"}
                strokeWidth={1.5}
              />
              <text x={LABEL_X} y={step.y - 3} fontSize={10} fill="var(--color-fg-default)">
                {`${step.sha} ${step.summary}`}
              </text>
              <text x={LABEL_X} y={step.y + 12} fontSize={9} fill={step.emphasis ? "var(--color-fg-accent)" : "var(--color-fg-muted)"}>
                {step.stopLabel}
              </text>
            </g>
          ))}

          {/* Time axis — oldest commit at the top, matching the order the steps happened in. */}
          <text x={20} y={LANE_END_Y + 18} fontSize={9} fill="var(--color-fg-muted)">time ↓ (oldest at the top)</text>
        </Svg>
      </Wrapper>
    </>
  );
}

GitBlameCopyDiagram.displayName = "GitBlameCopyDiagram";
