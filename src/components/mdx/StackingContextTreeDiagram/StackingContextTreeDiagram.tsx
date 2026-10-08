import type { JSX } from "react";
import { CODE_FONT, BADGE_COLORS, NODES, EDGES, CONTEXT_BOX } from "@/components/mdx/StackingContextTreeDiagram/StackingContextTreeDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/StackingContextTreeDiagram/StackingContextTreeDiagram.styles";

// Approximate pill width for a badge label, so short and long version numbers both get snug padding.
function badgeWidth(label: string): number {
  return 16 + label.length * 7.5;
}

/*
  Static tree of nested stacking contexts with "version number" badges. Exists to make the post's core rule visual:
  a child's z-index is only compared inside its parent's context, so 9999 inside a 1 is really 1.9999 — and loses to 10.
*/
export default function StackingContextTreeDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 640 390" role="img" aria-labelledby="stacking-context-tree-diagram-title stacking-context-tree-diagram-desc">
          <title id="stacking-context-tree-diagram-title">Nested stacking contexts as version numbers</title>
          <desc id="stacking-context-tree-diagram-desc">
            A document tree. The html element is the root stacking context. It has two children: a sticky header with
            z-index 10, and a main element with position relative and z-index 1. Inside main sits a fixed modal with
            z-index 9999. A dashed outline marks the stacking context of main, drawn around main and the modal. The
            effective position of the modal is 1.9999, so at the root the header at 10 beats main at 1, and the header
            paints over the modal.
          </desc>

          {/* <main>'s stacking context — the boundary the modal's z-index can't cross. */}
          <rect
            x={CONTEXT_BOX.x} y={CONTEXT_BOX.y} width={CONTEXT_BOX.width} height={CONTEXT_BOX.height} rx={12}
            fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} strokeDasharray="6 4"
          />
          <text x={CONTEXT_BOX.x + CONTEXT_BOX.width / 2} y={CONTEXT_BOX.y + CONTEXT_BOX.height - 10} textAnchor="middle" fontSize={11} fontStyle="italic" fill="var(--color-fg-accent)">
            main&apos;s stacking context
          </text>

          {EDGES.map(([x1, y1, x2, y2]) => (
            <line key={`${x1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-border-default)" strokeWidth={1.5} />
          ))}

          {NODES.map((node) => {
            const colors = BADGE_COLORS[node.outcome];
            // Badges sit on the node's top-right corner, like a version tag pinned to the element.
            const pillWidth = node.badge ? badgeWidth(node.badge) : 0;
            const pillX = node.x + node.width - pillWidth - 12;

            return (
              <g key={node.key}>
                <rect x={node.x} y={node.y} width={node.width} height={node.height} rx={8} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
                <text x={node.x + 14} y={node.y + 22} fontSize={13} fontWeight={700} fontFamily={CODE_FONT} fill="var(--color-fg-default)">{node.tag}</text>
                <text x={node.x + 14} y={node.y + 40} fontSize={11} fontFamily={CODE_FONT} fill="var(--color-fg-muted)">{node.css}</text>

                {node.badge && (
                  <>
                    <rect x={pillX} y={node.y - 11} width={pillWidth} height={22} rx={11} fill="var(--color-bg-default)" />
                    <rect x={pillX} y={node.y - 11} width={pillWidth} height={22} rx={11} fill={colors.fill} stroke={colors.stroke} strokeWidth={1.5} />
                    <text x={pillX + pillWidth / 2} y={node.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={colors.text}>{node.badge}</text>
                  </>
                )}
              </g>
            );
          })}

          {/* The comparison that actually happens at the root. */}
          <text x={320} y={354} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">
            At the root, only <tspan fontWeight={700} fill="var(--color-fg-success)">10</tspan> and <tspan fontWeight={700} fill="var(--color-fg-accent)">1</tspan>{"\u00A0"}are compared — so the header paints over all of &lt;main&gt;,
          </text>
          <text x={320} y={374} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">
            including the modal, whose 9999 really means <tspan fontWeight={700} fill="var(--color-fg-danger)">1.9999</tspan>.
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

StackingContextTreeDiagram.displayName = "StackingContextTreeDiagram";
