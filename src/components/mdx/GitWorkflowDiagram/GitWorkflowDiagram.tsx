import type { JSX } from "react";
import type { GitWorkflowDiagramProps } from "@/components/mdx/GitWorkflowDiagram/GitWorkflowDiagram.types";
import { NODE_R, GIT_WORKFLOW_CONFIG } from "@/components/mdx/GitWorkflowDiagram/GitWorkflowDiagram.constants";
import { getWorkflowNodeColor } from "@/components/mdx/GitWorkflowDiagram/GitWorkflowDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/GitWorkflowDiagram/GitWorkflowDiagram.styles";

/*
  Static SVG diagram of one branching workflow's topology — GitHub Flow's single short-lived feature branch,
  Git Flow's two long-lived lines with feature/release/hotfix branches, or Trunk-Based's single direct line.
*/
export default function GitWorkflowDiagram({ variant }: GitWorkflowDiagramProps): JSX.Element {
  const config = GIT_WORKFLOW_CONFIG[variant];

  return (
    <>
      <Wrapper>
        <Svg viewBox={config.viewBox} role="img" aria-labelledby={`git-workflow-${variant}-title`}>
          <title id={`git-workflow-${variant}-title`}>{config.title}</title>

          {config.labels.map((label) => (
            <text key={label.text + label.x} x={label.x} y={label.y} textAnchor={label.anchor} fontSize={10} fill="var(--color-fg-muted)">
              {label.text}
            </text>
          ))}

          {config.edges.map((edge, index) => (
            <line key={index} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
          ))}

          {config.nodes.map((node, index) => {
            const color = getWorkflowNodeColor(node.style);
            return (
              <g key={index}>
                <circle cx={node.x} cy={node.y} r={NODE_R} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
                {node.label && (
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize={10} fill="var(--color-fg-default)">{node.label}</text>
                )}
              </g>
            );
          })}

          <text x={config.captionX} y={config.captionY} textAnchor="middle" fontSize={11} fontFamily="'Alan Sans', 'Source Sans 3', system-ui, sans-serif" fill="var(--color-fg-default)">
            {config.caption}
          </text>

          {/* Legend — only github-flow and git-flow have merge-commit nodes to distinguish from regular ones
              (trunk-based has no styled nodes at all). Each branch-type dot (feature/release/hotfix) already
              sits right under its own text label above, so those don't need a legend entry too. */}
          {variant !== "trunk-based" && (
            <g fontSize={10}>
              <circle cx={20} cy={config.captionY + 30} r={6} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
              <text x={34} y={config.captionY + 34} fill="var(--color-fg-default)">commit</text>

              <circle cx={140} cy={config.captionY + 30} r={6} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
              <text x={154} y={config.captionY + 34} fill="var(--color-fg-default)">merge commit</text>
            </g>
          )}
        </Svg>
      </Wrapper>
    </>
  );
}

GitWorkflowDiagram.displayName = "GitWorkflowDiagram";
