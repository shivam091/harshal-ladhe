import type { JSX } from "react";
import type { GitMergeDiagramProps } from "@/components/mdx/GitMergeDiagram/GitMergeDiagram.types";
import GitCommitPanel from "@/components/mdx/GitMergeDiagram/GitCommitPanel";
import { BEFORE_MAIN_Y, BEFORE_FEATURE_Y, AFTER_MAIN_Y, AFTER_FEATURE_Y, GIT_MERGE_CONFIG } from "@/components/mdx/GitMergeDiagram/GitMergeDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GitMergeDiagram/GitMergeDiagram.styles";

/*
  Static SVG diagram comparing a fast-forward merge (main's pointer just moves) to a three-way merge (a new
  merge commit is created with two parents) — one variant per outcome, matching the post's own ASCII art.
*/
export default function GitMergeDiagram({ variant }: GitMergeDiagramProps): JSX.Element {
  const config = GIT_MERGE_CONFIG[variant];

  return (
    <>
      <Wrapper>
        <Svg viewBox="-40 0 360 300" role="img" aria-labelledby={`git-merge-${variant}-title`}>
          <title id={`git-merge-${variant}-title`}>
            {variant === "fast-forward"
              ? "Diagram of a fast-forward merge: main's pointer moves forward along feature's existing commits, with no new commit created."
              : "Diagram of a three-way merge: main and feature both have new commits, so a new merge commit is created joining both."}
          </title>

          <defs>
            <marker id="git-merge-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          <text x={15} y={BEFORE_MAIN_Y + 4} textAnchor="end" fontSize={10} fill="var(--color-fg-muted)">main</text>
          <text x={15} y={BEFORE_FEATURE_Y + 4} textAnchor="end" fontSize={10} fill="var(--color-fg-muted)">feature</text>
          <GitCommitPanel nodes={config.before.nodes} edges={config.before.edges} />

          <line x1={170} y1={118} x2={170} y2={192} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#git-merge-arrow)" />
          <text x={170} y={140} textAnchor="middle" fontSize={11} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-default)">
            {config.captionCommand}
          </text>
          <text x={170} y={155} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">{config.captionExplanation}</text>

          <text x={15} y={AFTER_MAIN_Y + 4} textAnchor="end" fontSize={10} fill="var(--color-fg-muted)">main</text>
          {variant === "three-way" && (
            <text x={15} y={AFTER_FEATURE_Y + 4} textAnchor="end" fontSize={10} fill="var(--color-fg-muted)">feature</text>
          )}
          <GitCommitPanel nodes={config.after.nodes} edges={config.after.edges} />

          {/* Legend — only the three-way variant has an emphasized (merge commit) node to explain. */}
          {variant === "three-way" && (
            <g fontSize={10}>
              <circle cx={60} cy={280} r={6} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
              <text x={74} y={284} fill="var(--color-fg-default)">commit</text>

              <circle cx={170} cy={280} r={6} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
              <text x={184} y={284} fill="var(--color-fg-default)">merge commit</text>
            </g>
          )}
        </Svg>
      </Wrapper>
    </>
  );
}

GitMergeDiagram.displayName = "GitMergeDiagram";
