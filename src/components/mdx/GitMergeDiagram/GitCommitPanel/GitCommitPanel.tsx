import type { JSX } from "react";
import type { GitCommitPanelProps } from "@/components/mdx/GitMergeDiagram/GitMergeDiagram.types";
import { NODE_R } from "@/components/mdx/GitMergeDiagram/GitMergeDiagram.constants";

// One before/after commit graph — edges are drawn first so the nodes sit on top of them.
export default function GitCommitPanel({ nodes, edges }: GitCommitPanelProps): JSX.Element {
  return (
    <>
      {edges.map((edge, index) => (
        <line
          key={`edge-${index}`}
          x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2}
          stroke="var(--color-fg-muted)" strokeWidth={1.5}
        />
      ))}
      {nodes.map((node) => (
        <g key={`${node.x}-${node.y}`}>
          <circle
            cx={node.x} cy={node.y} r={NODE_R}
            fill={node.emphasis ? "var(--color-bg-accent-muted)" : "var(--color-bg-muted)"}
            stroke={node.emphasis ? "var(--color-border-accent-emphasis)" : "var(--color-border-default)"}
            strokeWidth={1.5}
          />
          <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">{node.label}</text>
        </g>
      ))}
    </>
  );
}

GitCommitPanel.displayName = "GitCommitPanel";
