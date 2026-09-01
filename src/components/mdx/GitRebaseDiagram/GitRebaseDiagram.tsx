import type { JSX } from "react";
import {
  NODE_R, BEFORE_MAIN_Y, BEFORE_FEATURE_Y, AFTER_MAIN_Y, AFTER_FEATURE_Y,
  BEFORE_NODES, BEFORE_EDGES, AFTER_NODES, AFTER_EDGES
} from "@/components/mdx/GitRebaseDiagram/GitRebaseDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GitRebaseDiagram/GitRebaseDiagram.styles";

/*
  Static SVG diagram of the post's own rebase example — feature's commits (D, E) replayed as new commits
  (D', E') on top of main's latest commit, contrasted with the unchanged "before" branch-off from main.
*/
export default function GitRebaseDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="-40 0 360 300" role="img" aria-labelledby="git-rebase-diagram-title">
          <title id="git-rebase-diagram-title">
            Diagram of git rebase main on feature: before, feature branches off main at commit B with its own
            commits D and E; after, those commits are replayed as new commits D&apos; and E&apos; on top of
            main&apos;s latest commit C, rather than moved or merged in place.
          </title>

          <defs>
            <marker id="git-rebase-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          <text x={15} y={BEFORE_MAIN_Y + 4} textAnchor="end" fontSize={10} fill="var(--color-fg-muted)">main</text>
          <text x={15} y={BEFORE_FEATURE_Y + 4} textAnchor="end" fontSize={10} fill="var(--color-fg-muted)">feature</text>
          {BEFORE_EDGES.map((edge, index) => (
            <line key={`before-edge-${index}`} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
          ))}
          {BEFORE_NODES.map((node) => (
            <g key={`before-${node.x}-${node.y}`}>
              <circle cx={node.x} cy={node.y} r={NODE_R} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">{node.label}</text>
            </g>
          ))}

          <line x1={170} y1={118} x2={170} y2={175} stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#git-rebase-arrow)" />
          <text x={170} y={140} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">git rebase main</text>
          <text x={170} y={155} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">replays D, E as new commits D&apos;, E&apos;</text>

          <text x={15} y={AFTER_MAIN_Y + 4} textAnchor="end" fontSize={10} fill="var(--color-fg-muted)">main</text>
          <text x={15} y={AFTER_FEATURE_Y + 4} textAnchor="end" fontSize={10} fill="var(--color-fg-muted)">feature</text>
          {AFTER_EDGES.map((edge, index) => (
            <line key={`after-edge-${index}`} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
          ))}
          {AFTER_NODES.map((node) => (
            <g key={`after-${node.x}-${node.y}`}>
              <circle
                cx={node.x} cy={node.y} r={NODE_R}
                fill={node.emphasis ? "var(--color-bg-accent-muted)" : "var(--color-bg-muted)"}
                stroke={node.emphasis ? "var(--color-border-accent-emphasis)" : "var(--color-border-default)"}
                strokeWidth={1.5}
              />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">{node.label}</text>
            </g>
          ))}

          {/* Legend — distinguishes original commits from the replayed (new-SHA) ones in the "after" panel. */}
          <g fontSize={10}>
            <circle cx={60} cy={270} r={6} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
            <text x={74} y={274} fill="var(--color-fg-default)">original commit</text>

            <circle cx={200} cy={270} r={6} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
            <text x={214} y={274} fill="var(--color-fg-default)">replayed commit</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

GitRebaseDiagram.displayName = "GitRebaseDiagram";
