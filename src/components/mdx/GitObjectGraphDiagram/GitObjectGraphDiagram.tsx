import type { JSX } from "react";
import { OBJECT_NODES, OBJECT_EDGES } from "@/components/mdx/GitObjectGraphDiagram/GitObjectGraphDiagram.constants";
import { getObjectNodeStyle } from "@/components/mdx/GitObjectGraphDiagram/GitObjectGraphDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/GitObjectGraphDiagram/GitObjectGraphDiagram.styles";

/*
  Static SVG diagram of the post's own example object graph — a commit pointing at its root tree, which fans
  out to file blobs and a nested subtree, coloring each of the three Git object types distinctly.
*/
export default function GitObjectGraphDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 504 410" role="img" aria-labelledby="git-object-graph-diagram-title">
          <title id="git-object-graph-diagram-title">
            Diagram of a Git commit pointing at its root tree, which points at a blob for index.js, a blob for
            styles.css, and a nested tree for src/, which itself points at a blob for utils.js.
          </title>

          {OBJECT_EDGES.map((edge, index) => (
            <line key={index} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
          ))}

          {OBJECT_NODES.map((node) => {
            const style = getObjectNodeStyle(node.kind);
            return (
              <g key={node.label}>
                <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={6} fill={style.fill} stroke={style.stroke} strokeWidth={1.5} />
                <text x={node.x + node.w / 2} y={node.y + node.h / 2 + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">{node.label}</text>
              </g>
            );
          })}

          {/* Legend — left-aligns to the leftmost node's left edge (the blob (index.js) box, x=18). */}
          <g fontSize={11}>
            <rect x={18} y={359} width={17} height={17} rx={4} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" />
            <text x={42} y={373} fill="var(--color-fg-default)">commit</text>

            <rect x={150} y={359} width={17} height={17} rx={4} fill="var(--color-bg-attention-muted)" stroke="var(--color-border-attention-emphasis)" />
            <text x={174} y={373} fill="var(--color-fg-default)">tree</text>

            <rect x={258} y={359} width={17} height={17} rx={4} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" />
            <text x={282} y={373} fill="var(--color-fg-default)">blob</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

GitObjectGraphDiagram.displayName = "GitObjectGraphDiagram";
